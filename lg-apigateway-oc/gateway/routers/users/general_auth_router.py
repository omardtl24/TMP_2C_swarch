from fastapi import APIRouter, Request, Response, HTTPException
from fastapi.responses import RedirectResponse
import httpx
from gateway.utils.proxy import proxy_request
from gateway.config import USERS_SERVICE_URL

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/oauth2/authorization/google", include_in_schema=False)
async def oauth2_google_redirect():
    # Redirige a /oauth2/authorization/google en el MS de usuarios (sin /auth)
    url = f"{USERS_SERVICE_URL}/oauth2/authorization/google"
    return RedirectResponse(url)

@router.api_route("{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def auth_proxy(path: str, request: Request):
    # Todas las rutas deben mantener el prefijo /auth al reenviar
    forward_url = f"{USERS_SERVICE_URL}/auth/{path}"
    return await proxy_request(request, forward_url)

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
