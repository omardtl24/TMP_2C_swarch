import json
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from gateway.services.auth import verify_jwt
from gateway.services.group_expenses import fetchExpensesById
from gateway.services.events import fetchEventById, fetchExpensesByEventId 
from gateway.services.users import fetchUserById

router = APIRouter(prefix="/api/group-expenses", tags=["events"])


@router.get("/events/{event_id}")
async def fetch_expenses_by_event(
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

    event_entity = await fetchEventById(event_id, user_details)
    if not event_entity:
        raise HTTPException(status_code=404, detail="Event not found")

    event_expenses = await fetchExpensesByEventId(event_id, user_details)

    response_json = []

    forwarded_headers = {}
    if "authorization" in request.headers:
        forwarded_headers["Authorization"] = request.headers["authorization"]

    if event_expenses:
        for expense in event_expenses:
            expense_external_id = expense.get("externalDocId")
            try:
                doc_expense = await fetchExpensesById(expense_external_id, user_details)
                temp_response = doc_expense.copy() if doc_expense else {}
                temp_response["id"] = expense.get("id")
                temp_response["creatorId"] = expense.get("creatorId")
                expense_payer_id = doc_expense.get("payerId")
                try:
                    user_data = await fetchUserById(expense_payer_id, forwarded_headers)
                    temp_response["payerName"] = user_data.get("name", "Unknown Payer")
                except HTTPException as e:
                    temp_response["payerName"] = "Unknown Payer"
            except HTTPException as e:
                temp_response = {"id": expense_external_id, "error": str(e)}
            response_json.append(temp_response)

    return Response(
        content=json.dumps(response_json),
        status_code=200
    )