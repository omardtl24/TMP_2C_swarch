# API Gateway Postman Collections

This folder contains Postman collections for testing the API Gateway endpoints of the Cuentas Claras project. These collections cover the main API flows for events, group expenses, and personal expenses.

## Collections

- **Events AG.postman_collection.json**: Requests related to event management.
- **Group Expense AG.postman_collection.json**: Requests for group expense operations.
- **Personal Expense AG.postman_collection.json**: Requests for personal expense management.

## Usage Instructions

1. **Import the Collections**
   - Open Postman.
   - Click `Import` and select the desired `.postman_collection.json` files from the `tests/` directory.

2. **Set Up Environment/Variables**
   - Some requests require authentication via JWT tokens.
   - Before running secured requests, obtain a valid JWT (e.g., via the login or OAuth2 flow) and set it in the relevant collection or environment variable (commonly named `token` or `access_token`).
   - If the collection uses collection variables (e.g., `{{token}}`), update these by clicking on the collection, navigating to `Variables`, and pasting your JWT value.

3. **Run Requests**
   - Use the requests as documented in each collection. Some requests depend on variables set by previous requests (e.g., resource IDs or tokens).
   - Follow the order if chaining is required (e.g., create, then update, then delete).

## Notes

- **Token Update**: If your token expires or you log in as a different user, remember to update the token variable before running secured requests.
- **Base URL**: Ensure the request URLs match your running API Gateway instance (e.g., `http://localhost:8000/`). Default port for this deploymemnt is 8000.
- **Chained Variables**: Some requests automatically set variables (like IDs) for use in subsequent requests. Check the `Tests` tab in Postman for these scripts.

## Troubleshooting

- If you receive authentication errors, double-check your token variable and ensure it is valid and not expired.
- For CORS or network issues, verify that the API Gateway is running and accessible from your machine.
