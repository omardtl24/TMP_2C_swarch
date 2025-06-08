import json
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from httpx import AsyncClient
from gateway.services.auth import verify_jwt
from gateway.services.events import fetchParticipantsByEventId
from gateway.services.users import fetchUserById
from gateway.utils.proxy import proxy_request

router = APIRouter(prefix="/api/events", tags=["events"])


@router.get("/{event_id}/participants")
async def fetch_participants_by_event(
    event_id: str,
    request: Request,
    token_payload: dict = Depends(verify_jwt),
):
    """
    Fetches participants for a specific event.

    1) Extracts information from JWT (verify_jwt).
    2) Call service fetchParticipantsByEventId to retrieve participants for the specific event.
    3) Call service fetchUserById for each participant to get participantName.
    3) Return ParticipantType[]:
       { participantId, participantName }.
    """
    user_details = {
        "x-user-id":       token_payload.get("sub"),
        "x-user-email":    token_payload.get("email"),
        "x-user-username": token_payload.get("userName"),
        "x-user-name":     token_payload.get("name"),
    }

    participants = await fetchParticipantsByEventId(event_id, user_details)

    forwarded_headers = {}
    if "authorization" in request.headers:
        forwarded_headers["Authorization"] = request.headers["authorization"]

    for participant in participants:
        print(f"Processing participant: {participant}")
        user_id = participant.get("participantId")
        if user_id:
            try:
                user_data = await fetchUserById(user_id, forwarded_headers)
                print(f"Fetched user data for participantId {user_id}: {user_data}")
                participant["participantName"] = user_data.get("name", "Unknown Participant")
            except HTTPException as e:
                print(f"Error fetching user data for participantId {user_id}: {e}")
                participant["participantName"] = "Unknown Participant"
        else:
            print(f"Participant {participant.get('id')} has no participantId, setting participantName to 'Unknown Participant'")
            participant["participantName"] = "Unknown Participant"
        participant.pop("id", None)

    return Response(
        content=json.dumps(participants),
        status_code=200
    )