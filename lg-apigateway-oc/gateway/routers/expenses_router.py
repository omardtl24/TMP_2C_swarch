from fastapi import APIRouter, Request, Depends
from gateway.auth import verify_jwt
from gateway.proxy import proxy_request
from gateway.config import EXPENSES_SERVICE_URL

router = APIRouter(prefix="/expenses", tags=["expenses"])

@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def expenses_proxy(
    path: str,
    request: Request,
    token_payload: dict = Depends(verify_jwt)
):
    user_id = token_payload.get("sub")
    if user_id:
        request.scope["headers"].append((b"x-user-id", str(user_id).encode()))
    return await proxy_request(request, EXPENSES_SERVICE_URL)
