from fastapi import APIRouter, Request, Depends
from gateway.auth import verify_jwt
from gateway.proxy import proxy_request
from gateway.config import EVENTS_SERVICE_URL

router = APIRouter(prefix="/events", tags=["events"])

@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def events_proxy(
    path: str,
    request: Request,
    token_payload: dict = Depends(verify_jwt)
):
    user_id = token_payload.get("sub")
    if user_id:

        request.scope["headers"].append((b"x-user-id", user_id.encode()))

    return await proxy_request(request, EVENTS_SERVICE_URL)
