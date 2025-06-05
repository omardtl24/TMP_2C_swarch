from fastapi import FastAPI
import strawberry.fastapi
from gateway.graphql.schema import schema
from fastapi.middleware.cors import CORSMiddleware
from gateway.routers.auth_router import router as auth_router
from gateway.routers.general_events_router import router as events_router
from gateway.routers.fetch_event_details import router as events_details
from gateway.routers.fetch_events_participating import router as events_participating
from gateway.routers.expenses_router import router as expenses_router
from gateway.routers.personal_router import router as personal_router

app = FastAPI(title="API Gateway")

origins = [  
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "API Gateway corriendo correctamente"}

app.include_router(auth_router)
app.include_router(events_router)
app.include_router(expenses_router)
app.include_router(events_details)
app.include_router(events_participating)
app.include_router(personal_router)
graphql_app = strawberry.fastapi.GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")
