import json
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from gateway.services.auth import verify_jwt
from gateway.services.group_expenses import fetchExpenseDetail
from gateway.services.events import fetchExpensesByEventId, fetchEventById
from gateway.services.users import fetchUserById

router = APIRouter(prefix="/api/events", tags=["events"])


@router.get("/{event_id}")
async def fetch_events_detail(
    event_id: str,
    request: Request,
    token_payload: dict = Depends(verify_jwt)
):
    """
    Fetch expenses by event ID.

    1) Extracts information from JWT (verify_jwt).
    2) Calls service events_fetchExpensesByEventId to retrieve the expenses for an event.
    3) Calls service group_expenses_fetchExpensesByEventId to retrieve group expenses for the event.
    4) Merges the two lists of expenses using merge_expenses.
    5) For each expense, calls service fetchUserById to get payerName.
    6) Returns a list of expenses with the following structure:
       { creatorId, id, concept, total, type, payerId, payerName }.
    """

    user_details = {
        "x-user-id":       token_payload.get("sub"),
        "x-user-email":    token_payload.get("email"),
        "x-user-username": token_payload.get("userName"),
        "x-user-name":     token_payload.get("name"),
    }

    event = await fetchEventById(event_id, user_details)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    event_expenses = await fetchExpensesByEventId(event_id, user_details)

    total_event = 0
    my_balance = 0
    
    if event_expenses:
        
        group_expense_entity = []

        for expense in event_expenses:
            expense_external_id = expense.get("externalDocId")
            try:
                doc_expense = await fetchExpenseDetail(expense_external_id, user_details)
                group_expense_entity.append(doc_expense)
            except HTTPException as e:
                pass

        for expense in group_expense_entity:
            if expense.get("total") is not None:
                total_event += expense.get("total", 0)
            else:
                pass

            participation =  expense.get("participation")
            if participation:
                for part in participation:
                    if part.get("userId") == user_details.get("x-user-id"):
                        my_balance += part.get("portion", 0)
            else:
                pass
    
    response_json = event.copy()
    response_json["total_expense"] = total_event
    response_json["my_balance"] = my_balance

    return Response(
        content=json.dumps(response_json),
        status_code=200
    )