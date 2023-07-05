from fastapi import APIRouter, HTTPException, Query
from .storage import get_orders_storage
from .schema import Order, OrderUpdateSchema, OrderCreateSchema

router = APIRouter()

ORDERS_STORAGE = get_orders_storage()

@router.post("/")
async def create_order(order: OrderCreateSchema) -> Order:
    id = len(ORDERS_STORAGE) + 1
    new_order = Order(**order.dict(), id=id)
    ORDERS_STORAGE[id] = new_order
    return new_order

@router.get("/")
async def get_orders() -> list[Order]:
    return list(get_orders_storage().values())


@router.get("/{order_id}")
async def get_order(order_id: int) -> Order:
    try:
        return ORDERS_STORAGE[order_id]
    except KeyError:
        raise HTTPException(
            status_code=404, detail=f"Order with ID={order_id} does not exist."
        )

@router.patch("/{order_id}")
async def update_order(
    order_id: int, updated_order: OrderUpdateSchema
) -> Order:
    stored_order = None
    try:
        stored_order = ORDERS_STORAGE[order_id]
    except KeyError:
        raise HTTPException(
            status_code=404, detail=f"Order with ID={order_id} does not exist."
        )
    if not updated_order.customer and not updated_order.address:
        raise HTTPException(
            status_code=422, detail="Must contain at least one non-empty field."
        )
    if stored_order.customer:
        stored_order.customer = updated_order.customer
    
    if stored_order.address:
        stored_order.address = updated_order.address

    return stored_order

@router.delete("/{order_id}")
async def delete_order(order_id: int) -> None:
    try:
        del ORDERS_STORAGE[order_id]
    except KeyError:
        raise HTTPException(
            status_code=404, detail=f"order with ID={order_id} does not exist."
        )


@router.post("/")
async def create_order(order: OrderCreateSchema) -> Order:
    id = len(ORDERS_STORAGE) + 1
    new_order = order(**order.dict(), id=id)
    ORDERS_STORAGE[id] = new_order
    return new_order