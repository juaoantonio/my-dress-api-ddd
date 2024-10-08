import { ISearchableRepository } from "@core/@shared/domain/repository/repository.interface";
import { Product, ProductId } from "@core/products/domain/product";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { SearchParams } from "@core/@shared/domain/repository/search-params";
import { SearchResult } from "@core/@shared/domain/repository/search-result";

export interface IProductRepository<
  Id extends ProductId,
  A extends Product<Id>,
  Filter = string,
  SearchInput extends SearchParams<Filter> = SearchParams<Filter>,
  SearchOutput extends SearchResult<A> = SearchResult<A>,
> extends ISearchableRepository<
    ProductId,
    A,
    Filter,
    SearchInput,
    SearchOutput
  > {
  getAllAvailableForPeriod(period: Period): Promise<A[]>;

  getAllNotAvailableForPeriod(period: Period): Promise<A[]>;
}
