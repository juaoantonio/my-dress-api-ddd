import { Dress } from "./dress.aggregate-root";
import { DressId } from "./dress-id.vo";
import { IProductRepository } from "@core/products/domain/product.repository";
import {
  SearchParams,
  SearchParamsConstructorProps,
} from "@core/@shared/domain/repository/search-params";
import { SearchResult } from "@core/@shared/domain/repository/search-result";
import { InvalidSearchParamsError } from "@core/@shared/domain/error/invalid-search-params.error";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { ClutchFilter } from "@core/products/domain/clutch/clutch.repository";

export type DressFilter = {
  name?: string;
  model?: string;
  color?: string;
  fabric?: string;
  rentPrice?: number;
  available?: boolean;
  period?: Period;
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

    const filter: DressFilter = {
      ...(_value?.name && { name: _value.name }),
      ...(_value?.color && { color: _value.color }),
      ...(_value?.model && { model: _value.model }),
      ...(_value?.fabric && { fabric: _value.fabric }),
      ...(_value?.rentPrice && { rentPrice: _value.rentPrice }),
      ...(_value?.available !== undefined && { available: _value.available }),
      ...(_value?.period && { period: _value.period }),
    };
    this._filter = Object.values(filter).length === 0 ? null : filter;
  }

  static create(
    props: Omit<SearchParamsConstructorProps<ClutchFilter>, "filter"> & {
      filter?: Omit<DressFilter, "period"> & {
        startDate?: string;
        endDate?: string;
      };
    } = {},
  ) {
    if (
      props.filter?.available !== undefined &&
      (!props.filter?.startDate || !props.filter?.endDate)
    ) {
      throw new InvalidSearchParamsError([
        "as datas de 'startDate' e 'endDate' são obrigatórias quando 'available' é passado",
      ]);
    }
    return new DressSearchParams({
      ...props,
      filter: {
        ...props.filter,
        ...(props.filter?.startDate && {
          period: Period.create({
            startDate: DateVo.create(props.filter.startDate),
            endDate: DateVo.create(props.filter.endDate),
          }),
        }),
      },
    });
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
