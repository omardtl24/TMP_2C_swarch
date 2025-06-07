from fastapi import APIRouter, HTTPException, Request
from gateway.config import USERS_SERVICE_URL
from httpx import AsyncClient


def fetchUserById(userId):
    """
    Fetches a user by their ID.
    
    Args:
        userId (str): The ID of the user to fetch.
    
    Returns:
        dict: The user data if found, otherwise None.
    """
    url = f"{USERS_SERVICE_URL}/users/{userId}"
    with AsyncClient() as client:
        response = client.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)

    