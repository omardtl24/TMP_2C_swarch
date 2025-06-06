from fastapi import APIRouter, Request, Response, HTTPException
import httpx
from gateway.config import USERS_SERVICE_URL


router = APIRouter(prefix="/auth", tags=["auth"])

@router.api_route("{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def auth_proxy(path: str, request: Request):
    forward_url = f"{USERS_SERVICE_URL}/auth/{path}"
    body = await request.body()

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.request(
                method=request.method,
                url=forward_url,
                headers={k: v for k, v in request.headers.items() if k.lower() not in ["host", "content-length"]},
                content=body,
                params=request.query_params
            )
        except httpx.RequestError as exc:
            raise HTTPException(status_code=502, detail=f"Error conectando a UserService: {exc}")

    return Response(content=resp.content, status_code=resp.status_code, headers=dict(resp.headers))
