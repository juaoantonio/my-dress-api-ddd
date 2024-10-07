import { Dress } from "./dress.aggregate-root";
import { DressId } from "./dress-id.vo";
import { IProductRepository } from "@core/products/domain/product.repository";

export interface IDressRepository extends IProductRepository<DressId, Dress> {}
