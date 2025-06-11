from fastapi import APIRouter, Request
import httpx
from gateway.utils.proxy import proxy_request
from gateway.config import USERS_SERVICE_URL


router = APIRouter(prefix="/auth", tags=["auth"])

@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def auth_proxy(path: str, request: Request):
    return await proxy_request(request, USERS_SERVICE_URL)

