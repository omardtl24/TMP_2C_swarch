# COMANDO PARA CORRER EL SCRIPT
"""
$env:JWT_TOKEN="tu_jwt_real_aqui"
python load_balancer_test.py
"""

import httpx
import asyncio
import os

API_URL = "http://localhost:81/api/events/me"  
JWT = "eyJraWQiOiIxIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJuYW1lIjoiTWFyaWEgQ2FtaWxhIFNhbmNoZXogUGFleiIsInN1YiI6IjEiLCJ1c2VyTmFtZSI6ImNhbWlsYSIsImV4cCI6MTc1MjAzMTU0MSwiZW1haWwiOiJtYXJpYWNhbWlsYTEzMDM3MEBnbWFpbC5jb20ifQ.LydOwuUyQxTdtPiQAeUnuC4ejfK-KqybZwEdwXIOO8BgHBrw4se1R8UJ1hMoY3gWFubIDIvUQej9IPN5jovbScfUv47yKnv3TUE0xq8FRhVGw4LVifvqnhYUGOhwLUBiHfvaJeI2uLmuMSdvHuNE8bO3apBE95JQ4qhTl4BuFJ5OMUs99YiMhHYm-qUfuXvoOOBkXsJbmr4oXs6bRVfiTfcOXeJG1he8F5bHHWP1YW0SXv12K7PTQsBTfUiOyYxudrbBEPFzLpVpx8l_DtTWQN8ur7034CpLp2VHwPbBpLz9H_ogoSECXhnX3u6CQfsXuRm3O5nMtdGGLEyxkNR4ng"
if not JWT:
    print("Error: JWT_TOKEN environment variable not set")
    exit(1)

HEADERS = {
    "Authorization": f"Bearer {JWT}"
}

async def fetch(i):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(API_URL, headers=HEADERS)
            print(f"[{i}] Status: {response.status_code}")
        except Exception as e:
            print(f"[{i}] Error:", e)

async def main():
    #maximo encontrado a prueba y error 50 
    tasks = [fetch(i) for i in range(150)]  # número de requests
    await asyncio.gather(*tasks)

asyncio.run(main())