import strawberry
from typing import List, Optional
import httpx
from gateway.config import EXPENSES_GRAPHQL_URL, EVENTS_GRAPHQL_URL
from fastapi import HTTPException, UploadFile
from gateway.auth import verify_jwt
from fastapi import Depends


@strawberry.type
class ExpenseEntityType:
    id: strawberry.ID
    creatorId: str
    externalDocId: str
    eventId: strawberry.ID

@strawberry.type
class BalanceType:
    userId: str
    balance: float

@strawberry.type
class ParticipationType:
    userId: str
    state: int
    portion: float

@strawberry.type
class ExpenseDocumentType:
    id: strawberry.ID
    payerId: str
    total: float
    concept: str
    type: str
    participation: List[ParticipationType]
    supportImageId: Optional[str]

@strawberry.input
class NewExpenseInput:
    eventId: strawberry.ID
    externalDocId: str

@strawberry.input
class DeleteExpenseInput:
    expenseId: strawberry.ID

@strawberry.input
class NewExpenseDocumentInput:
    total: float
    concept: str
    type: str  
    participation: List[ParticipationType]

@strawberry.input
class UpdateExpenseDocumentInput:
    documentId: strawberry.ID
    total: float
    concept: str
    type: str
    participation: List[ParticipationType]

@strawberry.input
class DeleteExpenseDocumentInput:
    documentId: strawberry.ID

#  UTILS INTERNOS PARA LLAMAR POR HTTP

async def call_graphql(
    url: str,
    query: str,
    variables: dict,
    headers: dict,
    files: dict = None
) -> dict:
    """
    Realiza una llamada HTTP POST a un endpoint GraphQL.
    - Si `files` no es None, construye multipart/form-data (para subir imágenes).
    - De lo contrario, envía JSON.
    """
    async with httpx.AsyncClient() as client:
        if files:
            # multipart
            data = {
                "operations": (None, httpx.utils.to_json({"query": query, "variables": variables}), "application/json"),
                "map": (None, httpx.utils.to_json(files["map"]), "application/json"),
            }
            # combine data + archivo(s)
            multiparts = {**data, **files["files"]}
            resp = await client.post(url, files=multiparts, headers=headers)
        else:
            payload = {"query": query, "variables": variables}
            resp = await client.post(url, json=payload, headers=headers)

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Error al llamar a {url}: {resp.text}")
    result = resp.json()
    if result.get("errors"):
        raise HTTPException(status_code=400, detail=result["errors"])
    return result["data"]

# Extrae headers de usuario desde el JWT validado por FastAPI
def build_forwarded_headers(token_payload: dict) -> dict:
    return {
        "x-user-id": token_payload.get("sub"),
        "x-user-email": token_payload.get("email"),
        "x-user-username": token_payload.get("userName"),
        "x-user-name": token_payload.get("name"),
    }

# ----------------------------------------
#  QUERY RESOLVERS (SQL + Mongo)
# ----------------------------------------

@strawberry.type
class Query:

    # ——— EXPENSE SQL ———

    @strawberry.field
    async def expensesByEvent(
        self,
        eventId: strawberry.ID,
        token_payload: dict = Depends(verify_jwt)
    ) -> List[ExpenseEntityType]:
        """
        Llama a la mutación 'expensesByEvent' de SQL.
        """
        headers = build_forwarded_headers(token_payload)
        query = """
        query ExpensesByEvent($eventId: ID!) {
          expensesByEvent(eventId: $eventId) {
            id creatorId externalDocId eventId
          }
        }
        """
        data = await call_graphql(EVENTS_GRAPHQL_URL, query, {"eventId": eventId}, headers)
        return [ExpenseEntityType(**e) for e in data["expensesByEvent"]]

    @strawberry.field
    async def expenseDetail(
        self,
        expenseId: strawberry.ID,
        token_payload: dict = Depends(verify_jwt)
    ) -> Optional[ExpenseEntityType]:
        headers = build_forwarded_headers(token_payload)
        query = """
        query ExpenseDetail($expenseId: ID!) {
          expenseDetail(expenseId: $expenseId) {
            id creatorId externalDocId eventId
          }
        }
        """
        data = await call_graphql(EVENTS_GRAPHQL_URL, query, {"expenseId": expenseId}, headers)
        e = data.get("expenseDetail")
        return ExpenseEntityType(**e) if e else None

    @strawberry.field
    async def sumExpensesByEvent(
        self,
        eventId: strawberry.ID,
        token_payload: dict = Depends(verify_jwt)
    ) -> float:
        headers = build_forwarded_headers(token_payload)
        query = """
        query SumExpensesByEvent($eventId: ID!) {
          sumExpensesByEvent(eventId: $eventId)
        }
        """
        data = await call_graphql(EVENTS_GRAPHQL_URL, query, {"eventId": eventId}, headers)
        return data["sumExpensesByEvent"]

    @strawberry.field
    async def sumExpensesPaidByUserInEvent(
        self,
        eventId: strawberry.ID,
        token_payload: dict = Depends(verify_jwt)
    ) -> float:
        headers = build_forwarded_headers(token_payload)
        query = """
        query SumExpensesPaidByUserInEvent($eventId: ID!) {
          sumExpensesPaidByUserInEvent(eventId: $eventId)
        }
        """
        data = await call_graphql(EVENTS_GRAPHQL_URL, query, {"eventId": eventId}, headers)
        return data["sumExpensesPaidByUserInEvent"]

    @strawberry.field
    async def calculateBalances(
        self,
        eventId: strawberry.ID,
        token_payload: dict = Depends(verify_jwt)
    ) -> List[BalanceType]:
        headers = build_forwarded_headers(token_payload)
        query = """
        query CalculateBalances($eventId: ID!) {
          calculateBalances(eventId: $eventId) {
            userId balance
          }
        }
        """
        data = await call_graphql(EVENTS_GRAPHQL_URL, query, {"eventId": eventId}, headers)
        return [BalanceType(**b) for b in data["calculateBalances"]]

    @strawberry.field
    async def sumAllExpenses(
        self,
        token_payload: dict = Depends(verify_jwt)
    ) -> float:
        headers = build_forwarded_headers(token_payload)
        query = """
        query SumAllExpenses {
          sumAllExpenses
        }
        """
        data = await call_graphql(EVENTS_GRAPHQL_URL, query, {}, headers)
        return data["sumAllExpenses"]

    # ——— EXPENSE MONGO ———

    @strawberry.field
    async def expenseDocumentById(
        self,
        documentId: strawberry.ID,
        token_payload: dict = Depends(verify_jwt)
    ) -> Optional[ExpenseDocumentType]:
        headers = build_forwarded_headers(token_payload)
        query = """
        query ExpenseDocumentById($documentId: ID!) {
          expenseDocumentById(documentId: $documentId) {
            id payerId total concept type participation { userId state portion } supportImageId
          }
        }
        """
        data = await call_graphql(EXPENSES_GRAPHQL_URL, query, {"documentId": documentId}, headers)
        doc = data.get("expenseDocumentById")
        return ExpenseDocumentType(
            id=doc["id"],
            payerId=doc["payerId"],
            total=doc["total"],
            concept=doc["concept"],
            type=doc["type"],
            participation=[ParticipationType(**p) for p in doc["participation"]],
            supportImageId=doc.get("supportImageId")
        ) if doc else None

    @strawberry.field
    async def expensesPaidByMe(
        self,
        token_payload: dict = Depends(verify_jwt)
    ) -> List[ExpenseDocumentType]:
        headers = build_forwarded_headers(token_payload)
        query = """
        query ExpensesPaidByMe {
          expensesPaidByMe {
            id payerId total concept type participation { userId state portion } supportImageId
          }
        }
        """
        data = await call_graphql(EXPENSES_GRAPHQL_URL, query, {}, headers)
        return [
            ExpenseDocumentType(
                id=d["id"],
                payerId=d["payerId"],
                total=d["total"],
                concept=d["concept"],
                type=d["type"],
                participation=[ParticipationType(**p) for p in d["participation"]],
                supportImageId=d.get("supportImageId")
            )
            for d in data["expensesPaidByMe"]
        ]

    @strawberry.field
    async def expensesParticipatedByMe(
        self,
        token_payload: dict = Depends(verify_jwt)
    ) -> List[ExpenseDocumentType]:
        headers = build_forwarded_headers(token_payload)
        query = """
        query ExpensesParticipatedByMe {
          expensesParticipatedByMe {
            id payerId total concept type participation { userId state portion } supportImageId
          }
        }
        """
        data = await call_graphql(EXPENSES_GRAPHQL_URL, query, {}, headers)
        return [
            ExpenseDocumentType(
                id=d["id"],
                payerId=d["payerId"],
                total=d["total"],
                concept=d["concept"],
                type=d["type"],
                participation=[ParticipationType(**p) for p in d["participation"]],
                supportImageId=d.get("supportImageId")
            )
            for d in data["expensesParticipatedByMe"]
        ]

    @strawberry.field
    async def searchExpenseDocumentsByType(
        self,
        type: str,
        token_payload: dict = Depends(verify_jwt)
    ) -> List[ExpenseDocumentType]:
        headers = build_forwarded_headers(token_payload)
        query = """
        query SearchExpenseDocumentsByType($type: ExpenseType!) {
          searchExpenseDocumentsByType(type: $type) {
            id payerId total concept type participation { userId state portion } supportImageId
          }
        }
        """
        data = await call_graphql(EXPENSES_GRAPHQL_URL, query, {"type": type}, headers)
        return [
            ExpenseDocumentType(
                id=d["id"],
                payerId=d["payerId"],
                total=d["total"],
                concept=d["concept"],
                type=d["type"],
                participation=[ParticipationType(**p) for p in d["participation"]],
                supportImageId=d.get("supportImageId")
            )
            for d in data["searchExpenseDocumentsByType"]
        ]

    @strawberry.field
    async def searchExpenseDocumentsByConcept(
        self,
        keyword: str,
        token_payload: dict = Depends(verify_jwt)
    ) -> List[ExpenseDocumentType]:
        headers = build_forwarded_headers(token_payload)
        query = """
        query SearchExpenseDocumentsByConcept($keyword: String!) {
          searchExpenseDocumentsByConcept(keyword: $keyword) {
            id payerId total concept type participation { userId state portion } supportImageId
          }
        }
        """
        data = await call_graphql(EXPENSES_GRAPHQL_URL, query, {"keyword": keyword}, headers)
        return [
            ExpenseDocumentType(
                id=d["id"],
                payerId=d["payerId"],
                total=d["total"],
                concept=d["concept"],
                type=d["type"],
                participation=[ParticipationType(**p) for p in d["participation"]],
                supportImageId=d.get("supportImageId")
            )
            for d in data["searchExpenseDocumentsByConcept"]
        ]


# ----------------------------------------
#  MUTATION RESOLVERS (SQL + Mongo)
# ----------------------------------------

@strawberry.type
class Mutation:

    # ——— EXPENSE SQL ———

    @strawberry.mutation
    async def createExpense(
        self,
        input: NewExpenseInput,
        token_payload: dict = Depends(verify_jwt)
    ) -> ExpenseEntityType:
        headers = build_forwarded_headers(token_payload)
        query = """
        mutation CreateExpense($input: NewExpenseInput!) {
          createExpense(input: $input) {
            id creatorId externalDocId eventId
          }
        }
        """
        data = await call_graphql(EVENTS_GRAPHQL_URL, query, {"input": input.__dict__}, headers)
        return ExpenseEntityType(**data["createExpense"])

    @strawberry.mutation
    async def deleteExpense(
        self,
        input: DeleteExpenseInput,
        token_payload: dict = Depends(verify_jwt)
    ) -> bool:
        headers = build_forwarded_headers(token_payload)
        query = """
        mutation DeleteExpense($input: DeleteExpenseInput!) {
          deleteExpense(input: $input)
        }
        """
        data = await call_graphql(EVENTS_GRAPHQL_URL, query, {"input": {"expenseId": input.expenseId}}, headers)
        return data["deleteExpense"]


    @strawberry.mutation
    async def createExpenseDocument(
        self,
        input: NewExpenseDocumentInput,
        supportImage: Optional[UploadFile] = None,
        token_payload: dict = Depends(verify_jwt)
    ) -> ExpenseDocumentType:
        headers = build_forwarded_headers(token_payload)
        mutation = """
        mutation CreateExpenseDocument($input: NewExpenseDocumentInput!, $supportImage: Upload) {
          createExpenseDocument(input: $input, supportImage: $supportImage) {
            id payerId total concept type participation { userId state portion } supportImageId
          }
        }
        """
        # Para archivos: construimos multipart
        if supportImage:
            operations = {
                "query": mutation,
                "variables": {
                    "input": {
                        "total": input.total,
                        "concept": input.concept,
                        "type": input.type,
                        "participation": [p.__dict__ for p in input.participation]
                    },
                    "supportImage": None
                }
            }
            map_part = {"0": ["variables.supportImage"]}
            files_dict = {
                "map": map_part,
                "files": {
                    "0": (supportImage.filename, await supportImage.read(), supportImage.content_type)
                }
            }
            data = await call_graphql(EXPENSES_GRAPHQL_URL, mutation, {}, headers, files=files_dict | {"map": map_part})
            doc = data["createExpenseDocument"]
        else:
            payload = {
                "query": mutation,
                "variables": {
                    "input": {
                        "total": input.total,
                        "concept": input.concept,
                        "type": input.type,
                        "participation": [p.__dict__ for p in input.participation]
                    },
                    "supportImage": None
                }
            }
            data = await call_graphql(EXPENSES_GRAPHQL_URL, mutation, payload["variables"], headers)
            doc = data["createExpenseDocument"]

        return ExpenseDocumentType(
            id=doc["id"],
            payerId=doc["payerId"],
            total=doc["total"],
            concept=doc["concept"],
            type=doc["type"],
            participation=[ParticipationType(**p) for p in doc["participation"]],
            supportImageId=doc.get("supportImageId")
        )

    @strawberry.mutation
    async def updateExpenseDocument(
        self,
        input: UpdateExpenseDocumentInput,
        supportImage: Optional[UploadFile] = None,
        token_payload: dict = Depends(verify_jwt)
    ) -> ExpenseDocumentType:
        headers = build_forwarded_headers(token_payload)
        mutation = """
        mutation UpdateExpenseDocument($input: UpdateExpenseDocumentInput!, $supportImage: Upload) {
          updateExpenseDocument(input: $input, supportImage: $supportImage) {
            id payerId total concept type participation { userId state portion } supportImageId
          }
        }
        """
        if supportImage:
            operations = {
                "query": mutation,
                "variables": {
                    "input": {
                        "documentId": input.documentId,
                        "total": input.total,
                        "concept": input.concept,
                        "type": input.type,
                        "participation": [p.__dict__ for p in input.participation]
                    },
                    "supportImage": None
                }
            }
            map_part = {"0": ["variables.supportImage"]}
            files_dict = {
                "map": map_part,
                "files": {
                    "0": (supportImage.filename, await supportImage.read(), supportImage.content_type)
                }
            }
            data = await call_graphql(EXPENSES_GRAPHQL_URL, mutation, {}, headers, files=files_dict | {"map": map_part})
            doc = data["updateExpenseDocument"]
        else:
            payload = {
                "query": mutation,
                "variables": {
                    "input": {
                        "documentId": input.documentId,
                        "total": input.total,
                        "concept": input.concept,
                        "type": input.type,
                        "participation": [p.__dict__ for p in input.participation]
                    },
                    "supportImage": None
                }
            }
            data = await call_graphql(EXPENSES_GRAPHQL_URL, mutation, payload["variables"], headers)
            doc = data["updateExpenseDocument"]

        return ExpenseDocumentType(
            id=doc["id"],
            payerId=doc["payerId"],
            total=doc["total"],
            concept=doc["concept"],
            type=doc["type"],
            participation=[ParticipationType(**p) for p in doc["participation"]],
            supportImageId=doc.get("supportImageId")
        )

    @strawberry.mutation
    async def deleteExpenseDocument(
        self,
        input: DeleteExpenseDocumentInput,
        token_payload: dict = Depends(verify_jwt)
    ) -> bool:
        headers = build_forwarded_headers(token_payload)
        mutation = """
        mutation DeleteExpenseDocument($input: DeleteExpenseDocumentInput!) {
          deleteExpenseDocument(input: $input)
        }
        """
        data = await call_graphql(EXPENSES_GRAPHQL_URL, mutation, {"input": {"documentId": input.documentId}}, headers)
        return data["deleteExpenseDocument"]



schema = strawberry.Schema(query=Query, mutation=Mutation)
