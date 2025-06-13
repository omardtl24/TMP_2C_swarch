from pydantic import BaseModel
from typing import List


class ParticipationInput(BaseModel):
    userId: str
    state: int
    portion: float


class NewExpenseUnified(BaseModel):
    eventId: int
    total: float
    concept: str
    type: str                 
    participation: List[ParticipationInput]