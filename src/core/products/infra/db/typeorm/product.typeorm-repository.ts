import { IProductRepository } from "@core/products/domain/product.repository";
import { Product, ProductId } from "@core/products/domain/product";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { ProductModel } from "@core/products/infra/db/typeorm/product.model";
import { BaseTypeormRepository } from "@core/@shared/infra/db/typeorm/base.typeorm-repository";

export abstract class ProductTypeormRepository<
    Id extends ProductId,
    P extends Product<Id>,
    M extends ProductModel,
  >
  extends BaseTypeormRepository<Id, P, M>
  implements IProductRepository<Id, P>
{
  abstract getAllAvailableForPeriod(period: Period): Promise<P[]>;

  abstract getAllNotAvailableForPeriod(period: Period): Promise<P[]>;

  abstract getEntity(): { new (...args: any[]): P };
}
