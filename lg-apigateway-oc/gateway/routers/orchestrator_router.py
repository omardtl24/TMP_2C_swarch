from fastapi import APIRouter, Request, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import JSONResponse
from gateway.auth import verify_jwt
from gateway.config import EVENTS_SERVICE_URL, EXPENSES_SERVICE_URL
import httpx

router = APIRouter(prefix="/orchestrator", tags=["orchestrator"])

@router.post("/expenses")
async def create_expense_orchestrated(
    request: Request,
    token_payload: dict = Depends(verify_jwt)
):
    # 1. Leer el form-data (multipart) para extraer campos y archivo
    form = await request.form()
    data = dict(form)
    support_image = form.get("supportImage")
    user_id = token_payload.get("sub")

    # 2. Llamar a groupexpenses (Mongo)
    mongo_url = f"{EXPENSES_SERVICE_URL}/expenses/create"  # Ajusta la ruta según tu microservicio
    files = {"supportImage": (support_image.filename, await support_image.read())} if support_image else None

    async with httpx.AsyncClient() as client:
        resp_mongo = await client.post(
            mongo_url,
            data=data,
            files=files,
            headers={"Authorization": request.headers.get("Authorization")}
        )
        if resp_mongo.status_code != 200:
            raise HTTPException(status_code=resp_mongo.status_code, detail="Error creando documento Mongo")
        mongo_doc = resp_mongo.json()
        external_doc_id = mongo_doc.get("id")  # Ajusta según el campo real

    # 3. Llamar a events (SQL) usando el externalDocId
    data["externalDocId"] = external_doc_id
    sql_url = f"{EVENTS_SERVICE_URL}/expenses/create"  # Ajusta la ruta según tu microservicio

    async with httpx.AsyncClient() as client:
        resp_sql = await client.post(
            sql_url,
            data=data,
            headers={"Authorization": request.headers.get("Authorization")}
        )
        if resp_sql.status_code != 200:
            raise HTTPException(status_code=resp_sql.status_code, detail="Error creando registro SQL")
        sql_entity = resp_sql.json()

    # 4. Retornar ambas respuestas (puedes personalizar esto)
    return JSONResponse(content={
        "mongo_document": mongo_doc,
        "sql_entity": sql_entity
    })