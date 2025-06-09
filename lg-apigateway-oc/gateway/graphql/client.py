from gql import Client, gql
from gql.transport.httpx import AsyncHTTPXTransport
from gateway.config import EXPENSES_GRAPHQL_URL

async def fetchWithAuth(
    document: str,
    variables: dict,
    headers: dict,
) -> dict:
    
    transport = AsyncHTTPXTransport(
        url=EXPENSES_GRAPHQL_URL,
        headers=headers,
        timeout=5.0,
    )
    async with Client(
        transport=transport,
        fetch_schema_from_transport=False,
    ) as session:
        return await session.execute(gql(document), variable_values=variables)
