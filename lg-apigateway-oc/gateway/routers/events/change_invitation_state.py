import json
from fastapi import APIRouter, Depends, Request, Response
from gateway.services.auth import verify_jwt
from gateway.services.events import patchEventInvitationState

router = APIRouter(prefix="/api/events", tags=["events"])

@router.patch("/{event_id}/invite")
async def change_invitation_state(
    event_id: str,
    request: Request,
    token_payload: dict = Depends(verify_jwt)
):
    """
    Changes the invitation state of an event.

    1) Extracts information from JWT (verify_jwt).
    2) Adds user details to the request headers.
    3) Applies the patch to the event invitation state in the events service.
    4) Returns the response wuth boolean enabled and event_id.
    """
    user_details = {
        "x-user-id":       token_payload.get("sub"),
        "x-user-email":    token_payload.get("email"),
        "x-user-username": token_payload.get("userName"),
        "x-user-name":     token_payload.get("name"),
    }

    enabled = request.query_params.get("enabled").lower() == "true"
    event_id = event_id.strip()

    print(f"Changing invitation state for event {event_id} to {enabled}")

    r = await patchEventInvitationState(
        event_id=event_id,
        invitationState=enabled,
        headers=user_details
    )
    print(f"Response from events service: {r}")
    content = {
            "enabled": r.get("invitationEnabled"),
            "code": r.get("invitationCode")
        }
    
    return Response(
        content=json.dumps(content),
        status_code=200
    )


