from gateway.config import EVENTS_SERVICE_URL
from fastapi import  HTTPException

from httpx import AsyncClient

async def fetchEventsByUserId(headers: dict) -> dict:
    """
    Fetches events where user participates.
    
    Args:
        headers (dict): Headers with user information.
    
    Returns:
        dict: The events data if found, otherwise raises HTTPException.
    """
    url = f"{EVENTS_SERVICE_URL}/events/participating"
    async with AsyncClient() as client:
        response = await client.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        
async def fetchEventById(event_id: str, headers: dict) -> dict:
    """
    Fetches an event by its ID.
    
    Args:
        event_id (str): The ID of the event to fetch.
        headers (dict): Headers with user information.
    
    Returns:
        dict: The event data if found, otherwise raises HTTPException.
    """
    url = f"{EVENTS_SERVICE_URL}/events/{event_id}"
    async with AsyncClient() as client:
        response = await client.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        
async def patchEventInvitationState(event_id: str, invitationState: bool, headers: dict) -> dict:
    """
    Patches the invitation state of an event.
    
    Args:
        event_id (str): The ID of the event to update.
        invitationState (bool): The new invitation state.
        headers (dict): Headers with user information.
    
    Returns:
        dict: The updated event data if successful, otherwise raises HTTPException.
    """
    url = f"{EVENTS_SERVICE_URL}/events/{event_id}/invite"
    async with AsyncClient() as client:
        response = await client.patch(url, headers=headers, 
                                      params={"enabled": invitationState})
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        
async def fetchParticipantsByEventId(event_id: str, headers: dict) -> dict:
    """
    Fetches participants of an event by its ID.
    
    Args:
        event_id (str): The ID of the event to fetch participants for.
        headers (dict): Headers with user information.
    
    Returns:
        dict: The participants data if found, otherwise raises HTTPException.
    """
    url = f"{EVENTS_SERVICE_URL}/events/{event_id}/participants"
    async with AsyncClient() as client:
        response = await client.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        

async def createExpensebyExpenseDocId(expenseDocId: str, eventId: str, headers: dict) -> dict:
    """
    Creates an expense by its document ID and associates it with an event.
    
    Args:
        expenseDocId (str): The document ID of the expense.
        eventId (str): The ID of the event to associate with.
        headers (dict): Headers with user information.
    
    Returns:
        dict: The created expense data if successful, otherwise raises HTTPException.
    """
    url = f"{EVENTS_SERVICE_URL}/expenses"
    async with AsyncClient() as client:
        response = await client.post(url, headers=headers, 
                                     params={"externalDocId": expenseDocId,
                                             "eventId": eventId})
        if response.status_code == 201:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        

async def fetchExpensesByEventId(eventId: str, headers: dict) -> dict:
    """
    Fetches expenses associated with an event by its ID.
    
    Args:
        eventId (str): The ID of the event to fetch expenses for.
        headers (dict): Headers with user information.
    
    Returns:
        dict: The expenses data if found, otherwise raises HTTPException.
    """
    url = f"{EVENTS_SERVICE_URL}/expenses/by-event/{eventId}"
    async with AsyncClient() as client:
        response = await client.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        
async def fetchExpenseByExpenseId(expenseId: str, headers: dict) -> dict:
    """
    Fetches an expense by its ID.
    
    Args:
        expenseId (str): The ID of the expense to fetch.
        headers (dict): Headers with user information.
    
    Returns:
        dict: The expense data if found, otherwise raises HTTPException.
    """
    url = f"{EVENTS_SERVICE_URL}/expenses/{expenseId}"
    async with AsyncClient() as client:
        response = await client.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        
async def deleteExpenseByExpenseId(expenseId: str, headers: dict) -> None:
    """
    Deletes an expense by its ID.
    
    Args:
        expenseId (str): The ID of the expense to delete.
        headers (dict): Headers with user information.
    
    Returns:
        None: If successful, otherwise raises HTTPException.
    """
    url = f"{EVENTS_SERVICE_URL}/expenses/{expenseId}"
    async with AsyncClient() as client:
        response = await client.delete(url, headers=headers)
        if response.status_code == 204:
            return
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)