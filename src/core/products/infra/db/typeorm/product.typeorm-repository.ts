import { IProductRepository } from "@core/products/domain/product.repository";
import { Product, ProductId } from "@core/products/domain/product";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { ProductModel } from "@core/products/infra/db/typeorm/product.model";
import { BaseTypeormRepository } from "@core/@shared/infra/db/typeorm/base.typeorm-repository";
import { SearchParams } from "@core/@shared/domain/repository/search-params";
import { SearchResult } from "@core/@shared/domain/repository/search-result";

export abstract class ProductTypeormRepository<
    Id extends ProductId,
    P extends Product<Id>,
    M extends ProductModel,
    Filter = string,
    SearchInput extends SearchParams<Filter> = SearchParams<Filter>,
    SearchOutput extends SearchResult<P> = SearchResult<P>,
  >
  extends BaseTypeormRepository<Id, P, M, Filter, SearchInput, SearchOutput>
  implements IProductRepository<Id, P, Filter, SearchInput, SearchOutput>
{
  abstract sortableFields: string[];

  abstract getAllAvailableForPeriod(period: Period): Promise<P[]>;

  abstract getAllNotAvailableForPeriod(period: Period): Promise<P[]>;

  abstract getEntity(): { new (...args: any[]): P };

  abstract search(props: SearchInput): Promise<SearchOutput>;
}
