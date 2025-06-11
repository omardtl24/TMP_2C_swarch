import json
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from httpx import AsyncClient
from gateway.services.auth import verify_jwt
from gateway.services.events import fetchEventsByUserId
from gateway.services.users import fetchUserById
from gateway.utils.proxy import proxy_request

router = APIRouter(prefix="/api/events", tags=["events"])


@router.get("/me")
async def fetch_event_by_user(
    request: Request,
    token_payload: dict = Depends(verify_jwt)
):
    """
    Fetches events where the user participates.

    1) Extracts information from JWT (verify_jwt).
    2) Call service fetchEventsByUserId to retrieve events where the user participates.
    3) Call service fetchUserById for each event to get creatorName.
    3) Return EventType[]:
       { id, name, description, creatorName, beginDate, endDate }.
    """
    user_details = {
        "x-user-id":       token_payload.get("sub"),
        "x-user-email":    token_payload.get("email"),
        "x-user-username": token_payload.get("userName"),
        "x-user-name":     token_payload.get("name"),
    }

    events = await fetchEventsByUserId(user_details)

    forwarded_headers = {}
    if "authorization" in request.headers:
        forwarded_headers["Authorization"] = request.headers["authorization"]

    for event in events:
        creator_id = event.get("creatorId")
        if creator_id:
            try:
                user_data = await fetchUserById(creator_id, forwarded_headers)
                event["creatorName"] = user_data.get("name", "Unknown Creator")
            except HTTPException as e:
                event["creatorName"] = "Unknown Creator"
        else:
            event["creatorName"] = "Unknown Creator"
        event.pop("creatorId", None)
    
    return Response(
        content=json.dumps(events),
        status_code=200
    )