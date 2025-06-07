from fastapi import APIRouter, Depends, Request
from gateway.services.auth import verify_jwt
from gateway.utils.proxy import proxy_request
from gateway.config import EVENTS_SERVICE_URL

router = APIRouter(prefix="/events", tags=["events"])


@router.api_route(
    "{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
)
async def events_proxy(
    path: str,
    request: Request,
    token_payload: dict = Depends(verify_jwt)
):
    """
    Proxy genérico para cualquier ruta bajo /events.
    Reenvía la petición al microservicio de Eventos,
    añadiendo los headers x-user-* al request.
    """
    print(f"Path: {path}")
    user_details = {
        "x-user-id":       token_payload.get("sub"),
        "x-user-email":    token_payload.get("email"),
        "x-user-username": token_payload.get("userName"),
        "x-user-name":     token_payload.get("name"),
    }
    for header_name, header_value in user_details.items():
        if header_value:
            request.scope["headers"].append(
                (header_name.encode(), str(header_value).encode())
            )

    return await proxy_request(request, EVENTS_SERVICE_URL)
