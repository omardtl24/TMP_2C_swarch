import httpx
import asyncio

API_URL = "http://localhost:80/api/events/me"  
JWT = "eyJraWQiOiIxIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJuYW1lIjoiTWFyaWEgQ2FtaWxhIFNhbmNoZXogUGFleiIsInN1YiI6IjEiLCJ1c2VyTmFtZSI6Im1hcmlhIiwiZXhwIjoxNzUxNjQ2MDk5LCJlbWFpbCI6Im1hcmlhY2FtaWxhMTMwMzcwQGdtYWlsLmNvbSJ9.rjPHMqCzwiw1u9_jGoyZtabWsOv-it6dnRFY1ImX_ib44USgZjqL3QLgolkwIAFjniT1tsrcACNTFImkRAJ8dtLg3KEfVOwbnz0Jx_gIDCTEtJ-sf43wgw7S2EWzGr_peH59MX63LuXsnxyZj_L_BO3sGQt5nRUpoGL_R2AFkmOPgBSihYFWyBUz7O8UeaBSu-TaLEJpBVEYzZg5Rbj1cKFfXmWheHVbl4_f_Qgp7uUm5XbmAr1MMWtQMXAgUiWQls5r8GgpIUmPRC0UltQCIBPg2CpW_ErmV3Iu7ukMm-jjHYPHmLrJCGd4wn8qccPBR1EG74t5JXqugi1Ft25DeQ" 

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