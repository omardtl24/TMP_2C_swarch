from fastapi import APIRouter, HTTPException, Request
from gateway.config import USERS_SERVICE_URL
from httpx import AsyncClient

async def fetchUserById(userId, headers: dict) -> dict:
    """
    Fetches a user by their ID.
    
    Args:
        userId (str): The ID of the user to fetch.
    
    Returns:
        dict: The user data if found, otherwise None.
    """
    url = f"{USERS_SERVICE_URL}/users/{userId}"
    async with AsyncClient() as client:
        response = await client.get(url,
                                    headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)