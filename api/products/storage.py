from functools import lru_cache

from .schema import Product

ProductStorageType = dict[int, Product]

PRODUCTS: ProductStorageType = {}

@lru_cache(maxsize=1)
def get_products_storage() -> ProductStorageType:
    return PRODUCTS