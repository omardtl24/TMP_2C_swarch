import json
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from gateway.services.auth import verify_jwt
from gateway.services.group_expenses import deleteExpense
from gateway.services.events import fetchExpenseByExpenseId, deleteExpenseByExpenseId

router = APIRouter(prefix="/api/group-expenses", tags=["events"])


@router.delete("/{expense_id}")
async def delete_expense(
    expense_id: str,
    request: Request,
    token_payload: dict = Depends(verify_jwt)
):
    """
    Creates a new expense.

    1) Extracts information from JWT (verify_jwt).
    2) Call service fetchExpenseByExpenseId to retrieve the event details.
    3) Call service deleteExpenseByExpenseId to delete the group expense by id.
    4) Call service deleteExpense to delete the expense document.
    5) Return a 204 response if successful.
    """
    user_details = {
        "x-user-id":       token_payload.get("sub"),
        "x-user-email":    token_payload.get("email"),
        "x-user-username": token_payload.get("userName"),
        "x-user-name":     token_payload.get("name"),
    }

    group_expense_entity = await fetchExpenseByExpenseId(expense_id, user_details)
    if not group_expense_entity:
        raise HTTPException(status_code=404, detail="Group expense not found")
    
    external_doc_id = group_expense_entity.get("externalDocId")
    
    try:
        await deleteExpenseByExpenseId(
            expenseId=group_expense_entity.get("id"),
            headers=user_details
        )
        print(f"Deleted group expense with ID: {group_expense_entity.get('id')}")
    except HTTPException as e:
        print(f"Error deleting group expense with ID {group_expense_entity.get('id')}: {e}")
        raise HTTPException(status_code=e.status_code, detail=e.detail)

    try:
        await deleteExpense(
            documentId=external_doc_id,
            headers=user_details
        )
    except HTTPException as e:
        print(f"Error deleting expense document with ID {external_doc_id}: {e}")
        raise HTTPException(status_code=e.status_code, detail=e.detail)

    return Response(
        status_code=204
    )