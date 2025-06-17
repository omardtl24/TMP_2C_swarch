import json
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from gateway.services.auth import verify_jwt
from gateway.services.group_expenses import fetchExpenseDetail
from gateway.services.events import fetchExpenseByExpenseId
from gateway.services.users import fetchUserById

router = APIRouter(prefix="/api/group-expenses", tags=["events"])


@router.get("/{expense_id}")
async def fetch_expense_detail(
    expense_id: str,
    request: Request,
    token_payload: dict = Depends(verify_jwt)
):
    """
    Fetch expense details by expense ID.

    1) Extracts information from JWT (verify_jwt).
    2) Calls service events_fetchExpenseByExpenseId to retrieve the expense details.
    3) Calls service group_expenses_fetchExpenseDetail to retrieve group expense details.
    4) Merges the two expense details using merge_expenses.
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

    event_expense_entity = await fetchExpenseByExpenseId(expense_id, user_details)
    if not event_expense_entity:
        raise HTTPException(status_code=404, detail="Expense not found")

    group_expense_entity = await fetchExpenseDetail(event_expense_entity.get("externalDocId"), user_details)
    if not group_expense_entity:
        raise HTTPException(status_code=404, detail="Group expenses not found for the event")

    response_json = group_expense_entity.copy()
    response_json["creatorId"] = event_expense_entity.get("creatorId")
    response_json.pop("id", None)

    forwarded_headers = {}
    if "authorization" in request.headers:
        forwarded_headers["Authorization"] = request.headers["authorization"]

    expense = response_json
    expense_payer_id = expense.get("payerId")
    if expense_payer_id:
        try:
            user_data = await fetchUserById(expense_payer_id, forwarded_headers)
            expense["payerName"] = user_data.get("name", "Unknown Payer")
        except HTTPException as e:
            expense["payerName"] = "Unknown Payer"
    else:
        expense["payerName"] = "Unknown Payer"
    
    return Response(
        content=json.dumps(response_json),
        status_code=200
    )