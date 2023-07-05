from pydantic import BaseModel


class ProductCreateSchema(BaseModel):
    product_name: str
    price: int
    description: str

    class Config:
        schema_extra = {
            "example": {
                "product_name": "Egg",
                "price": 14,
                "description": "Somethinh"

            }
        }

class ProductUpdateSchema(BaseModel):
    product_name: str | None
    price: int | None
    description: str | None

    class Config:
        schema_extra = {
            "example": {
                "product_name": "Jan Kowalski",
                "price": 30,
                "description": "casa"
            }
        }

class Product(ProductCreateSchema):
    id: int
