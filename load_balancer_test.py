# COMANDO PARA CORRER EL SCRIPT
"""
$env:JWT_TOKEN="tu_jwt_real_aqui"
python load_balancer_test.py
"""

import httpx
import asyncio
import os

API_URL = "http://localhost:81/api/events/me"  
JWT = os.getenv("JWT_TOKEN", "")  # Cargar desde variable de entorno

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
    tasks = [fetch(i) for i in range(200)]  # número de requests
    await asyncio.gather(*tasks)

asyncio.run(main())