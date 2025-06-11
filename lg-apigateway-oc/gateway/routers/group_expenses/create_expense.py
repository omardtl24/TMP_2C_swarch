import json
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from gateway.services.auth import verify_jwt
from gateway.services.group_expenses import createExpense
from gateway.services.events import fetchEventById, createExpensebyExpenseDocId
from gateway.services.users import fetchUserById

router = APIRouter(prefix="/api/group-expenses", tags=["events"])


@router.post("/events/{event_id}")
async def create_expense(
    event_id: str,
    request: Request,
    token_payload: dict = Depends(verify_jwt)
):
    """
    Creates a new expense.

    1) Extracts information from JWT (verify_jwt).
    2) Extracts expense data from request body.
    3) Calls service createExpense with the provided data.
    4) Call service fetchEventById to retrieve the event details.
    5) Call service fetchUserById for event to get payerName.
    6) Return EventType[]:
       { creatorId, id, concept, total, type, payerId, payerName }.
    """
    user_details = {
        "x-user-id":       token_payload.get("sub"),
        "x-user-email":    token_payload.get("email"),
        "x-user-username": token_payload.get("userName"),
        "x-user-name":     token_payload.get("name"),
    }

    raw_body = await request.body()
    if not raw_body:
        raise HTTPException(status_code=400, detail="Request body is empty")
    
    try:
        data = json.loads(raw_body)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Malformed JSON body")

    concept      = data.get("concept")
    total        = data.get("total")
    expense_type = data.get("type")
    payerId     = data.get("payerId")
    participation= data.get("participation")
    # supportImage: UploadFile | None = File(None)?

    if concept is None or total is None or expense_type is None or payerId is None or participation is None:
        raise HTTPException(status_code=422, detail="Missing one or more required fields")

    event = await fetchEventById(event_id, user_details)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    doc_expense = await createExpense(
        input={
            "concept": concept,
            "total": total,
            "type": expense_type,
            "payerId": payerId,
            "participation": participation,
        },
        headers=user_details
    )

    response_json = doc_expense.copy()

    group_expense_entity = await createExpensebyExpenseDocId(
        eventId=event_id,
        expenseDocId=doc_expense["id"],
        headers=user_details
    )

    forwarded_headers = {}
    if "authorization" in request.headers:
        forwarded_headers["Authorization"] = request.headers["authorization"]

    if payerId:
        try:
            user_data = await fetchUserById(payerId, forwarded_headers)
            response_json["payerName"] = user_data.get("name", "Unknown Payer")
        except HTTPException as e:
            response_json["payerName"] = "Unknown Payer"
    else:
        response_json["payerName"] = "Unknown Payer"

    response_json["id"] = group_expense_entity.get("id")
    response_json["creatorId"] = group_expense_entity.get("creatorId")

    return Response(
        content=json.dumps(response_json),
        status_code=200
    )