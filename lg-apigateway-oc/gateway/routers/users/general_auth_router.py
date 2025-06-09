from fastapi import APIRouter, Request
import httpx
from gateway.utils.proxy import proxy_request
#from gateway.config import PUBLIC_USERS_MICROSERVICE_PUBLIC_URL
from gateway.config import USERS_SERVICE_URL


router = APIRouter(prefix="/auth", tags=["auth"])

@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def auth_proxy(path: str, request: Request):
    # Solo pasa la base URL, el proxy se encarga del path
    return await proxy_request(request, USERS_SERVICE_URL)
    #return await proxy_request(request, PUBLIC_USERS_MICROSERVICE_PUBLIC_URL)

    # async with httpx.AsyncClient() as client:
    #     try:
    #         resp = await client.request(
    #             method=request.method,
    #             url=forward_url,
    #             headers={k: v for k, v in request.headers.items() if k.lower() not in ["host", "content-length"]},
    #             content=body,
    #             params=request.query_params
    #         )
    #     except httpx.RequestError as exc:
    #         raise HTTPException(status_code=502, detail=f"Error conectando a UserService: {exc}")

    # return Response(content=resp.content, status_code=resp.status_code, headers=dict(resp.headers))
