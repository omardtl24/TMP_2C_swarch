import httpx
import asyncio

API_URL = "http://localhost:8000/api/events/me"  
JWT = "" 

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
    tasks = [fetch(i) for i in range(50)]  # número de requests
    await asyncio.gather(*tasks)

asyncio.run(main())