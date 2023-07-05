from fastapi import APIRouter, HTTPException, Query
from .storage import get_products_storage
from .schema import Product, ProductCreateSchema, ProductUpdateSchema

router = APIRouter()

PRODUCTS_STORAGE = get_products_storage()

@router.get("/")
async def get_products() -> list[Product]:
    return list(get_products_storage().values())

@router.post("/")
async def create_product(product: ProductCreateSchema) -> Product:
    id = len(PRODUCTS_STORAGE) + 1
    new_product = Product(**product.dict(), id=id)
    PRODUCTS_STORAGE[id] = new_product
    return new_product


@router.get("/{product_id}")
async def get_product(product_id: int) -> Product:
    try:
        return PRODUCTS_STORAGE[product_id]
    except KeyError:
        raise HTTPException(
            status_code=404, detail=f"product with ID={product_id} does not exist."
        )


@router.patch("/{product_id}")
async def update_product(
    product_id: int, updated_product: ProductUpdateSchema
) -> Product:
    stored_product = None
    try:
        stored_product = PRODUCTS_STORAGE[product_id]
    except KeyError:
        raise HTTPException(
            status_code=404, detail=f"product with ID={product_id} does not exist."
        )
    if not updated_product.product_name and not updated_product.price:
        raise HTTPException(
            status_code=422, detail="Must contain at least one non-empty field."
        )
    if stored_product.product_name:
        stored_product.product_name = updated_product.product_name
    
    if stored_product.price:
        stored_product.price = updated_product.price

    if stored_product.description:
        stored_product.description = updated_product.description

    return stored_product

@router.delete("/{product_id}")
async def delete_product(product_id: int) -> None:
    try:
        del PRODUCTS_STORAGE[product_id]
    except KeyError:
        raise HTTPException(
            status_code=404, detail=f"product with ID={product_id} does not exist."
        )
