import { IRepository } from "@core/@shared/domain/repository/repository.interface";
import { Product, ProductId } from "@core/products/domain/product";
import { Period } from "@core/@shared/domain/value-objects/period.vo";

export interface IProductRepository<Id extends ProductId, A extends Product<Id>>
  extends IRepository<ProductId, A> {
  getAllAvailableForPeriod(period: Period): Promise<A[]>;

  getAllNotAvailableForPeriod(period: Period): Promise<A[]>;
}
