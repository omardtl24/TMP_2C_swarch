from fastapi import APIRouter, Request, Depends, UploadFile, File, HTTPException
from gateway.services.auth import verify_jwt
from gateway.schemas import NewExpenseUnified
import httpx
from gateway.config import EXPENSES_GRAPHQL_URL, EVENTS_GRAPHQL_URL

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.post("/create")
async def create_expense_unified(
    request: Request,
    data: NewExpenseUnified = Depends(),
    supportImage: UploadFile = File(None),
    token_payload: dict = Depends(verify_jwt)
):
    """
    1) Crea documento en Mongo
    2) Con externalDocId recibido, crea entidad en SQL
    """
    user_headers = {
        "x-user-id": token_payload.get("sub"),
        "x-user-email": token_payload.get("email"),
        "x-user-username": token_payload.get("userName"),
        "x-user-name": token_payload.get("name"),
    }
    forwarded_headers = {k: v for k, v in user_headers.items() if v is not None}

    # Crear documento en Mongo ---
    create_mongo_mutation = """
    mutation CreateExpenseDocument(
      $input: NewExpenseDocumentInput!,
      $supportImage: Upload
    ) {
      createExpenseDocument(input: $input, supportImage: $supportImage) {
        id
      }
    }
    """
    input_mongo = {
        "total": data.total,
        "concept": data.concept,
        "type": data.type,
        "participation": [
            {"userId": p.userId, "state": p.state, "portion": p.portion}
            for p in data.participation
        ]
    }

    async with httpx.AsyncClient() as client:
        if supportImage:
            operations = {
                "query": create_mongo_mutation,
                "variables": {
                    "input": input_mongo,
                    "supportImage": None
                }
            }
            map_part = {"0": ["variables.supportImage"]}
            files = {
                "operations": (None, httpx.utils.to_json(operations), "application/json"),
                "map": (None, httpx.utils.to_json(map_part), "application/json"),
                "0": (supportImage.filename, supportImage.file, supportImage.content_type)
            }
            resp_mongo = await client.post(
                EXPENSES_GRAPHQL_URL,
                files=files,
                headers=forwarded_headers
            )
        else:
            payload = {
                "query": create_mongo_mutation,
                "variables": {
                    "input": input_mongo,
                    "supportImage": None
                }
            }
            resp_mongo = await client.post(
                EXPENSES_GRAPHQL_URL,
                json=payload,
                headers=forwarded_headers
            )

    if resp_mongo.status_code != 200:
        raise HTTPException(status_code=502, detail="Error al crear documento Mongo: " + resp_mongo.text)
    result_mongo = resp_mongo.json()
    if result_mongo.get("errors"):
        raise HTTPException(status_code=400, detail=result_mongo["errors"])

    external_doc_id = result_mongo["data"]["createExpenseDocument"]["id"]

    # Crear entidad en SQL
    create_sql_mutation = """
    mutation CreateExpense(
      $eventId: ID!,
      $externalDocId: ID!
    ) {
      createExpense(input: {
        eventId: $eventId,
        externalDocId: $externalDocId
      }) {
        id
        creatorId
        externalDocId
        eventId
      }
    }
    """
    payload_sql = {
        "query": create_sql_mutation,
        "variables": {
            "eventId": str(data.eventId),
            "externalDocId": external_doc_id
        }
    }

    async with httpx.AsyncClient() as client:
        resp_sql = await client.post(
            EVENTS_GRAPHQL_URL,
            json=payload_sql,
            headers=forwarded_headers
        )

    if resp_sql.status_code != 200:
        delete_mongo_mutation = """
        mutation DeleteExpenseDocument($input: DeleteExpenseDocumentInput!) {
          deleteExpenseDocument(input: $input)
        }
        """
        payload_del = {
            "query": delete_mongo_mutation,
            "variables": {"input": {"documentId": external_doc_id}}
        }
        async with httpx.AsyncClient() as client:
            await client.post(
                EXPENSES_GRAPHQL_URL,
                json=payload_del,
                headers=forwarded_headers
            )
        raise HTTPException(status_code=502, detail="Error al crear entidad SQL: " + resp_sql.text)

    result_sql = resp_sql.json()
    if result_sql.get("errors"):
        delete_mongo_mutation = """
        mutation DeleteExpenseDocument($input: DeleteExpenseDocumentInput!) {
          deleteExpenseDocument(input: $input)
        }
        """
        payload_del = {
            "query": delete_mongo_mutation,
            "variables": {"input": {"documentId": external_doc_id}}
        }
        async with httpx.AsyncClient() as client:
            await client.post(
                EXPENSES_GRAPHQL_URL,
                json=payload_del,
                headers=forwarded_headers
            )
        raise HTTPException(status_code=400, detail=result_sql["errors"])

    # Devolver la entidad SQL creada
    return result_sql["data"]["createExpense"]


@router.delete("/delete")
async def delete_expense_unified(
    request: Request,
    expenseId: str,                 
    documentId: str,                
    token_payload: dict = Depends(verify_jwt)
):
    """
    1) Elimina ExpenseEntity en SQL (GraphQL).
    2) Elimina ExpenseDocument en Mongo (GraphQL).
    """

    user_headers = {
        "x-user-id": token_payload.get("sub"),
        "x-user-email": token_payload.get("email"),
        "x-user-username": token_payload.get("userName"),
        "x-user-name": token_payload.get("name"),
    }
    forwarded_headers = {k: v for k, v in user_headers.items() if v is not None}

    # Eliminar entidad en SQL 
    delete_sql_mutation = """
    mutation DeleteExpense($input: DeleteExpenseInput!) {
      deleteExpense(input: $input)
    }
    """
    payload_sql = {
        "query": delete_sql_mutation,
        "variables": {"input": {"expenseId": expenseId}}
    }
    async with httpx.AsyncClient() as client:
        resp_sql = await client.post(
            EVENTS_GRAPHQL_URL,
            json=payload_sql,
            headers=forwarded_headers
        )

    if resp_sql.status_code != 200:
        raise HTTPException(status_code=502, detail="Error al eliminar entidad SQL: " + resp_sql.text)
    result_sql = resp_sql.json()
    if result_sql.get("errors") or not result_sql["data"].get("deleteExpense"):
        raise HTTPException(status_code=400, detail=result_sql.get("errors", "No se pudo eliminar en SQL"))

    # --- Eliminar documento en Mongo ---
    delete_mongo_mutation = """
    mutation DeleteExpenseDocument($input: DeleteExpenseDocumentInput!) {
      deleteExpenseDocument(input: $input)
    }
    """
    payload_del = {
        "query": delete_mongo_mutation,
        "variables": {"input": {"documentId": documentId}}
    }
    async with httpx.AsyncClient() as client:
        resp_mongo = await client.post(
            EXPENSES_GRAPHQL_URL,
            json=payload_del,
            headers=forwarded_headers
        )

    if resp_mongo.status_code != 200:
        raise HTTPException(status_code=502, detail="Error al eliminar documento Mongo: " + resp_mongo.text)
    result_mongo = resp_mongo.json()
    if result_mongo.get("errors"):
        raise HTTPException(status_code=400, detail=result_mongo["errors"])

    return {"success": True}
