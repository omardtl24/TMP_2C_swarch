import os
from fastapi import FastAPI, HTTPException
#import strawberry.fastapi
#from gateway.graphql.schema import schema
from fastapi.middleware.cors import CORSMiddleware
from gateway.routers.users.general_auth_router import router as auth_router
from gateway.routers.events.general_events_router import router as events_router
from gateway.routers.events.fetch_events_by_user import router as events_by_user_router
from gateway.routers.events.get_participants_by_event import router as events_participants_router
from gateway.routers.events.change_invitation_state import router as change_invitation_state_router
#from gateway.routers.events.fetch_event_details import router as events_details
#from gateway.routers.events.fetch_events_participating import router as events_participating
from gateway.routers.group_expenses.expenses_router import router as expenses_router
from gateway.routers.personal_expenses.personal_router import router as personal_router

from gateway.utils.middlewares import responseFormat

app = FastAPI(title="API Gateway")

frontend_url = os.environ.get("PUBLIC_FRONTEND_URL", "PUBLIC_FRONTEND_PUBLIC_URL")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.middleware("http")(responseFormat)

@app.get("/")
def root():
    return {"message": "API Gateway corriendo correctamente"}

app.include_router(auth_router)
app.include_router(events_router)
app.include_router(expenses_router)
app.include_router(events_by_user_router)
app.include_router(events_participants_router)
app.include_router(change_invitation_state_router)
#app.include_router(events_details)
#app.include_router(events_participating)
app.include_router(personal_router)
#graphql_app = strawberry.fastapi.GraphQLRouter(schema)
#app.include_router(graphql_app, prefix="/graphql")
