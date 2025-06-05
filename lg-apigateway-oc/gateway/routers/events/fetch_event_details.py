# gateway/routers/events_router.py

from fastapi import APIRouter, Depends, HTTPException, Request
from httpx import AsyncClient
from gateway.auth import verify_jwt
from gateway.config import EVENTS_SERVICE_URL, USERS_SERVICE_URL, EXPENSES_GRAPHQL_URL
from gateway.proxy import proxy_request

router = APIRouter(prefix="/events", tags=["events"])


@router.get("/{event_id}")
async def fetch_event_detail(
    event_id: str,
    request: Request,
    token_payload: dict = Depends(verify_jwt)
):
    """
    1) Extrae userId desde JWT (verify_jwt).
    2) Llama a GET {EVENTS_SERVICE_URL}/events/{event_id} para obtener datos base.
    3) Llama a GraphQL en Gastos:
       - sumExpensesByEvent(eventId: $event_id)
       - sumExpensesPaidByUserInEvent(eventId: $event_id)
    4) Llama a GET {USERS_SERVICE_URL}/users/{creatorId} para obtener creatorName.
    5) Devuelve EventDetailType.
    """

    forwarded_headers = {}
    if "authorization" in request.headers:
        forwarded_headers["Authorization"] = request.headers["authorization"]

    async with AsyncClient() as client:
        resp_event = await client.get(
            f"{EVENTS_SERVICE_URL}/events/{event_id}",
            headers=forwarded_headers
        )
        if resp_event.status_code != 200:
            raise HTTPException(status_code=resp_event.status_code, detail=resp_event.text)

        ev = resp_event.json()
        creator_id = ev.get("creatorId")
        creator_name = None

        graphql_query_total = """
        query SumExpensesByEvent($eventId: ID!) {
          sumExpensesByEvent(eventId: $eventId)
        }
        """
        payload_total = {
            "query": graphql_query_total,
            "variables": {"eventId": event_id}
        }
        resp_graph_total = await client.post(
            EXPENSES_GRAPHQL_URL,
            json=payload_total,
            headers=forwarded_headers
        )
        if resp_graph_total.status_code != 200:
            raise HTTPException(status_code=502, detail="Error en sumExpensesByEvent: " + resp_graph_total.text)
        data_total = resp_graph_total.json()
        if data_total.get("errors"):
            # Propagamos el primer error
            msg = data_total["errors"][0].get("message", "Error desconocido")
            raise HTTPException(status_code=400, detail=f"sumExpensesByEvent: {msg}")
        total_expense = data_total["data"]["sumExpensesByEvent"]

        graphql_query_balance = """
        query SumExpensesPaidByUserInEvent($eventId: ID!) {
          sumExpensesPaidByUserInEvent(eventId: $eventId)
        }
        """
        payload_balance = {
            "query": graphql_query_balance,
            "variables": {"eventId": event_id}
        }
        resp_graph_balance = await client.post(
            EXPENSES_GRAPHQL_URL,
            json=payload_balance,
            headers=forwarded_headers
        )
        if resp_graph_balance.status_code != 200:
            raise HTTPException(status_code=502, detail="Error en sumExpensesPaidByUserInEvent: " + resp_graph_balance.text)
        data_balance = resp_graph_balance.json()
        if data_balance.get("errors"):
            msg = data_balance["errors"][0].get("message", "Error desconocido")
            raise HTTPException(status_code=400, detail=f"sumExpensesPaidByUserInEvent: {msg}")
        my_balance = data_balance["data"]["sumExpensesPaidByUserInEvent"]

        if creator_id:
            try:
                resp_user = await client.get(
                    f"{USERS_SERVICE_URL}/users/{creator_id}",
                    headers=forwarded_headers
                )
                if resp_user.status_code == 200:
                    user_data = resp_user.json()
                    creator_name = user_data.get("name")
                else:
                    creator_name = None
            except Exception:
                creator_name = None

    # Construir y devolver EventDetailType
    return {
        "id":                 str(ev["id"]),
        "name":               ev["name"],
        "description":        ev["description"],
        "creatorName":        creator_name,
        "beginDate":          ev["beginDate"],
        "endDate":            ev["endDate"],
        "creatorId":          ev.get("creatorId"),
        "invitationEnabled":  ev.get("invitationEnabled", False),
        "invitationCode":     ev.get("invitationCode"),
        "totalExpense":       total_expense,
        "myBalance":          my_balance
    }





