# gateway/routers/events_router.py

from fastapi import APIRouter, Depends, HTTPException, Request
from httpx import AsyncClient
from gateway.auth import verify_jwt
from gateway.config import EVENTS_SERVICE_URL, USERS_SERVICE_URL

router = APIRouter()

@router.get("/events/participating")
async def fetch_events_participating(
    request: Request,
    token_payload: dict = Depends(verify_jwt)
):
    """
    1) Extrae userId desde el JWT.
    2) Llama a GET {EVENTS_SERVICE_URL}/events/participating para traer eventos donde participa.
    3) Para cada evento:
       a) Llama a GET {EVENTS_SERVICE_URL}/events/{id} para obtener creatorId.
       b) Llama a GET {USERS_SERVICE_URL}/users/{creatorId} para obtener creatorName.
    4) Devuelve EventType[]:
       { id, name, description, creatorName, beginDate, endDate }.
    """
    forwarded_headers = {}
    if "authorization" in request.headers:
        forwarded_headers["Authorization"] = request.headers["authorization"]

    async with AsyncClient() as client:
        resp_list = await client.get(
            f"{EVENTS_SERVICE_URL}/events/participating",
            headers=forwarded_headers
        )
    if resp_list.status_code != 200:
        raise HTTPException(status_code=resp_list.status_code, detail=resp_list.text)

    events_part = resp_list.json()

    result = []
    async with AsyncClient() as client:
        for ev in events_part:
            ev_id = ev.get("id")
            if ev_id is None:
                continue
            resp_detail = await client.get(
                f"{EVENTS_SERVICE_URL}/events/{ev_id}",
                headers=forwarded_headers
            )
            if resp_detail.status_code != 200:
                continue

            ev_detail = resp_detail.json()
            creator_id = ev_detail.get("creatorId")
            creator_name = None
            if creator_id:
                try:
                    resp_user = await client.get(
                        f"{USERS_SERVICE_URL}/users/{creator_id}",
                        headers=forwarded_headers
                    )
                    if resp_user.status_code == 200:
                        user_data = resp_user.json()
                        creator_name = user_data.get("name")
                except Exception:
                    creator_name = None

            # Construir el objeto EventType
            result.append({
                "id":          str(ev_detail["id"]),
                "name":        ev_detail["name"],
                "description": ev_detail["description"],
                "creatorName": creator_name,
                "beginDate":   ev_detail["beginDate"],
                "endDate":     ev_detail["endDate"]
            })

    return result
