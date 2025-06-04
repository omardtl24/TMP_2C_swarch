from fastapi import FastAPI
from gateway.routers.auth_router import router as auth_router
from gateway.routers.events_router import router as events_router
from gateway.routers.expenses_router import router as expenses_router
from gateway.routers.personal_router import router as personal_router

app = FastAPI(title="API Gateway")

@app.get("/")
def root():
    return {"message": "API Gateway corriendo correctamente"}

app.include_router(auth_router)
app.include_router(events_router)
app.include_router(expenses_router)
app.include_router(personal_router)
