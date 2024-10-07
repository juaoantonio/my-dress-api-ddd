import { Clutch } from "@core/products/domain/clutch/clutch.aggregate";
import { ClutchId } from "@core/products/domain/clutch/clutch-id.vo";
import { IProductRepository } from "@core/products/domain/product.repository";

export interface IClutchRepository
  extends IProductRepository<ClutchId, Clutch> {}
