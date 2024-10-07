import { IRepository } from "@core/@shared/domain/repository/repository.interface";
import { Product, ProductId } from "@core/products/domain/product";
import { Period } from "@core/@shared/domain/value-objects/period.vo";

export interface IProductRepository<Id extends ProductId, A extends Product<Id>>
  extends IRepository<ProductId, A> {
  isAvailableForPeriod(dressId: ProductId, period: Period): Promise<boolean>;

  getAllAvailableDressesForPeriod(period: Period): Promise<A[]>;

  getAllNotAvailableDressesForPeriod(period: Period): Promise<A[]>;
}
