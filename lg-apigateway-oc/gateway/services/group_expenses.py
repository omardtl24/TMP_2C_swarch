from gateway.graphql.client import fetchWithAuth

async def createExpense(input: dict, headers: dict) -> dict:
    mutation = """
    mutation CreateExpense($input: NewExpenseDocumentInput!) {
      createExpenseDocument(input: $input) {
        id
        payerId
        total
        concept
        type
      }
    }
    """
    variables = {"input": input}
    result = await fetchWithAuth(mutation, variables, headers)
    print(result)
    return result["createExpenseDocument"]

async def editExpense(input_obj: dict, headers: dict) -> dict:
    mutation = """
    mutation UpdateExpense($input: UpdateExpenseDocumentInput!) {
      updateExpenseDocument(input: $input) {
        id
        payerId
        total
        concept
        type
      }
    }
    """
    variables = {"input": input_obj}
    result = await fetchWithAuth(mutation, variables, headers)
    return result["updateExpenseDocument"]

async def fetchExpensesByEventId(event_id: str, headers: dict) -> list[dict]:
    query = """
    query ExpensesByEvent($eventId: ID!) {
      searchExpenseDocumentsByEvent(eventId: $eventId) {
        id
        payerId
        total
        concept
        type
      }
    }
    """
    variables = {"eventId": event_id}
    result = await fetchWithAuth(query, variables, headers)
    return result["searchExpenseDocumentsByEvent"]

async def fetchExpenseDetail(document_id: str, headers: dict) -> dict:
    query = """
    query ExpenseById($id: ID!) {
      expenseDocumentById(documentId: $id) {
        id
        payerId
        total
        concept
        type
        participation {
          userId
          state
          portion
        }
      }
    }
    """
    variables = {"id": document_id}
    result = await fetchWithAuth(query, variables, headers)
    return result["expenseDocumentById"]

async def deleteExpense(document_id: str, headers: dict) -> bool:
    mutation = """
    mutation DeleteExpense($input: DeleteExpenseDocumentInput!) {
      deleteExpenseDocument(input: $input)
    }
    """
    variables = {"input": {"documentId": document_id}}
    result = await fetchWithAuth(mutation, variables, headers)
    return result["deleteExpenseDocument"]
