from fastapi import APIRouter, Request, Depends
from gateway.services.auth import verify_jwt
from gateway.utils.proxy import proxy_request
from gateway.config import PERSONAL_SERVICE_URL

router = APIRouter(prefix="/personal-expenses", tags=["personal"])

@router.api_route("{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def personal_proxy(
    path: str,
    request: Request,
    token_payload: dict = Depends(verify_jwt)
):
    user_details = {
        "x-user-id": token_payload.get("sub"),
        "x-user-email": token_payload.get("email"),
        "x-user-username": token_payload.get("userName"),
        "x-user-name": token_payload.get("name"),
    }
    
    for header_name, header_value in user_details.items():
        if header_value:
            request.scope["headers"].append(
                (header_name.encode(), str(header_value).encode())
            )
    return await proxy_request(request, PERSONAL_SERVICE_URL)
