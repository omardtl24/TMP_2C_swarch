import time
import httpx
from typing import Dict, Any
from jose import jwt, JWTError

from fastapi import Request, HTTPException, status

from gateway.config import JWKS_URL, JWT_ALGORITHM

# Cache global (en memoria) para JWKS:
# { "keys": [ {kty, alg, use, n, e, kid}, … ] }
_jwks_cache: Dict[str, Any] = {"keys": []}
_last_jwks_fetch = 0
_JWKS_CACHE_TTL = 3600  

async def _fetch_jwks() -> Dict[str, Any]:
    global _jwks_cache, _last_jwks_fetch

    now = time.time()
    if not _jwks_cache["keys"] or now - _last_jwks_fetch > _JWKS_CACHE_TTL:
        async with httpx.AsyncClient() as client:
            resp = await client.get(JWKS_URL, timeout=5.0)
            if resp.status_code != 200:
                raise HTTPException(
                    status_code=503,
                    detail="No se pudo descargar JWKS del UserService"
                )
            _jwks_cache = resp.json()
            _last_jwks_fetch = now
    return _jwks_cache

async def _get_public_key_for_token(token: str) -> Dict[str, Any]:
    try:
        unverified_header = jwt.get_unverified_header(token)
    except JWTError:
        raise HTTPException(status_code=401, detail="Header de token inválido")

    kid = unverified_header.get("kid")
    if not kid:
        raise HTTPException(status_code=401, detail="Token no tiene 'kid' en el header")

    jwks = await _fetch_jwks()
    for jwk_entry in jwks.get("keys", []):
        if jwk_entry.get("kid") == kid:
            return jwk_entry

    raise HTTPException(status_code=401, detail="Clave pública no encontrada en JWKS")

async def verify_jwt(request: Request) -> Dict[str, Any]:
    """
    1) Lee Authorization: Bearer <token>
    2) Busca la clave pública en el JWKS
    3) Verifica la firma del token
    4) Retorna el payload (claims) si es válido
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Falta cabecera Authorization con Bearer <token>"
        )
    token = auth_header.split(" ")[1]

    
    jwk_key = await _get_public_key_for_token(token)

    try:
       
        payload = jwt.decode(
            token,
            jwk_key,
            algorithms=[JWT_ALGORITHM]
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado"
        )
