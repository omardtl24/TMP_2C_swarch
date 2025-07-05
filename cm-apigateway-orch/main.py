import os
from fastapi import FastAPI, HTTPException
#import strawberry.fastapi
#from gateway.graphql.schema import schema
from fastapi.middleware.cors import CORSMiddleware
from gateway.routers.users.general_auth_router import router as auth_router
from gateway.routers.events.general_events_router import router as events_router
from gateway.routers.events.fetch_events_by_user import router as events_by_user_router
from gateway.routers.events.fetch_events_detail import router as events_details_router
from gateway.routers.events.get_participants_by_event import router as events_participants_router
from gateway.routers.events.change_invitation_state import router as change_invitation_state_router
from gateway.routers.group_expenses.create_expense import router as create_expense_router
from gateway.routers.group_expenses.delete_expense import router as delete_expense_router
from gateway.routers.group_expenses.update_expense import router as update_expense_router
from gateway.routers.group_expenses.fetch_expenses_by_event import router as fetch_expenses_by_event_router
from gateway.routers.group_expenses.fetch_expense_detail import router as fetch_expense_detail_router
from gateway.routers.personal_expenses.general_personal_expenses_router import router as personal_router

from gateway.utils.middlewares import responseFormat

app = FastAPI(title="API Gateway")

# CORS Origins
# Frontend web: NO necesita CORS (llamadas server-side)
# Mobile app: NO necesita CORS (app nativa, no navegador web)
# Solo necesario si hubiera llamadas desde navegador web directamente

app.add_middleware(
    CORSMiddleware,
    allow_origins=[],  # Sin orígenes permitidos por ahora
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health():
    return {"status": "UP", "service": "cm-apigateway-orch"}

app.middleware("http")(responseFormat)

@app.get("/")
def root():
    return {"message": "API Gateway corriendo correctamente"}

app.include_router(auth_router)
app.include_router(events_router)
app.include_router(create_expense_router)
app.include_router(update_expense_router)
app.include_router(delete_expense_router)
app.include_router(fetch_expenses_by_event_router)
app.include_router(fetch_expense_detail_router)
app.include_router(events_by_user_router)
app.include_router(events_participants_router)
app.include_router(change_invitation_state_router)
app.include_router(events_details_router)
app.include_router(personal_router)
