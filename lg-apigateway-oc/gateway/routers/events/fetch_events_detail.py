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
    if not event_expenses:
        raise HTTPException(status_code=404, detail="Event not found or has no expenses")

    group_expense_entity = []

    # forwarded_headers = {}
    # if "authorization" in request.headers:
    #     forwarded_headers["Authorization"] = request.headers["authorization"]

    for expense in event_expenses:
        expense_external_id = expense.get("externalDocId")
        try:
            doc_expense = await fetchExpenseDetail(expense_external_id, user_details)
            group_expense_entity.append(doc_expense)
        except HTTPException as e:
            print(f"Error fetching expense by ID {expense_external_id}: {e}")

    total_event = 0
    my_balance = 0
    for expense in group_expense_entity:
        if expense.get("total") is not None:
            total_event += expense.get("total", 0)
        else:
            print(f"Expense {expense.get('id')} has no total value, skipping balance calculation.")

        participation =  expense.get("participation")
        if participation:
            for part in participation:
                if part.get("userId") == user_details.get("x-user-id"):
                    my_balance += part.get("portion", 0)
        else:
            print(f"Expense {expense.get('id')} has no participation data, skipping balance calculation.")
            
    print(f"Total balance for event {event_id}: {total_event}")
    print(f"My balance for event {event_id}: {my_balance}")

    response_json = {
        "creatorId": expense.get("creatorId"),
        "invitacion_enabled": expense.get("invitationEnabled"),
        "invitationCode": expense.get("invitationCode"),
        "total_expense": total_event,
        "my_balance": my_balance,
    }

    print(f"Final response JSON: {response_json}")


    return Response(
        content=json.dumps(response_json),
        status_code=200
    )