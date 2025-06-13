import json
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from gateway.services.auth import verify_jwt
from gateway.services.group_expenses import editExpense
from gateway.services.events import fetchExpenseByExpenseId

router = APIRouter(prefix="/api/group-expenses", tags=["events"])


@router.put("/{expense_id}")
async def update_expense(
    expense_id: str,
    request: Request,
    token_payload: dict = Depends(verify_jwt)
):
    """
    Updates an existing expense.

    1) Extracts information from JWT (verify_jwt).
    2) Extracts expense data from request body.
    3) Calls service editExpense with the provided data.
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
        
    group_expense_entity = await fetchExpenseByExpenseId(expense_id, user_details)
    if not group_expense_entity:
        raise HTTPException(status_code=404, detail="Group expense not found")
    
    external_doc_id = group_expense_entity.get("externalDocId")

    doc_expense = await editExpense(
        input_obj={
            "documentId": external_doc_id,
            "concept": concept,
            "total": total,
            "type": expense_type,
            "payerId": payerId,
            "participation": participation,
        },
        headers=user_details
    )

    return Response(
        content=json.dumps(doc_expense),
        status_code=200
    )