import httpx
from fastapi import Request, Response, HTTPException

async def proxy_request(request: Request, target_base_url: str) -> Response:
    """
    Reenvía la petición entrante a `target_base_url` + ruta. 
    """
    async with httpx.AsyncClient() as client:
        dest_url = f"{target_base_url}{request.url.path}"
        method = request.method
        body = await request.body()

        forwarded_headers = {
            k: v for k, v in request.headers.items()
            if k.lower() not in ["host", "content-length"]
        }

        try:
            resp = await client.request(
                method=method,
                url=dest_url,
                headers=forwarded_headers,
                content=body,
                params=request.query_params,
                timeout=10.0
            )
        except httpx.RequestError as exc:
            raise HTTPException(status_code=503, detail=f"Servicio no disponible: {exc}")

    return Response(
        content=resp.content,
        status_code=resp.status_code,
        headers=dict(resp.headers)
    )
