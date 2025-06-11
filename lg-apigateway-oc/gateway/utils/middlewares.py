from fastapi import Request
from fastapi.responses import JSONResponse, Response
from gateway.utils.mapper import contentMapper
import json

async def responseFormat(request: Request, call_next):
    response = await call_next(request)

    if response.status_code == 204:
        # No content response, return empty JSON
        return Response(status_code=204)
    
    body = b""
    async for chunk in response.body_iterator:
        body += chunk

    # Decode and parse JSON
    try:
        content = json.loads(body.decode())
    except Exception as e:
        content = None

    if 200 <= response.status_code < 300:
        return JSONResponse(
            status_code=response.status_code,
            content={"status": "success", "data": contentMapper(content)},
        )
    else:
        message = None

        if isinstance(content, dict):
            message = content.get("detail", content)
        
        try :
            message = json.loads(message)
        except:
            pass

        try:
            message = message["apierror"]["message"]
        except Exception as e:
            pass

        return JSONResponse(
            status_code=response.status_code,
            content={"status": "error", "message": message.get("message") if isinstance(message, dict) else message}
            )