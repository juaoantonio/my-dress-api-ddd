import { Dress } from "./dress.aggregate-root";
import { DressId } from "./dress-id.vo";
import { IProductRepository } from "@core/products/domain/product.repository";
import {
  SearchParams,
  SearchParamsConstructorProps,
} from "@core/@shared/domain/repository/search-params";
import { SearchResult } from "@core/@shared/domain/repository/search-result";

export type DressFilter = {
  model?: string;
  color?: string;
  fabric?: string;
  rentPrice?: number;
};

export class DressSearchParams extends SearchParams<DressFilter> {
  constructor(props: SearchParamsConstructorProps<DressFilter> = {}) {
    super(props);
  }

  get filter() {
    return this._filter;
  }

  set filter(value: DressFilter | null) {
    const _value =
      !value || (value as unknown) === "" || typeof value !== "object"
        ? null
        : value;
    const filter = {
      ...(_value?.color && { color: _value.color }),
      ...(_value?.model && { model: _value.model }),
      ...(_value?.fabric && { fabric: _value.fabric }),
      ...(_value?.rentPrice && { rentPrice: _value.rentPrice }),
    };
    this._filter = Object.values(filter).length === 0 ? null : filter;
  }

  static create(
    props: Omit<SearchParamsConstructorProps<DressFilter>, "filter"> & {
      filter?: DressFilter;
    } = {},
  ) {
    return new DressSearchParams(props);
  }
}

export class DressSearchResult extends SearchResult<Dress> {}

export interface IDressRepository
  extends IProductRepository<
    DressId,
    Dress,
    DressFilter,
    DressSearchParams,
    DressSearchResult
  > {}
