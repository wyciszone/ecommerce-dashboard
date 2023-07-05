from pydantic import BaseModel

class OrderCreateSchema(BaseModel):
    customer: str
    total: int
    address: str

    class Config:
        schema_extra = {
            "example": {
                "customer": "Jan Kowalski",
                "total": 14.00,
                "address": "Poland 26-530",
            }
        }

class OrderUpdateSchema(BaseModel):
    customer: str | None
    total: float | None
    address: str | None

    class Config:
        schema_extra = {
            "example": {
                "customer": "Jan Kowalski",
                "address": "Poland 26-530"
            }
        }

class Order(OrderCreateSchema):
    id: int