import {
  SearchParams,
  SearchParamsConstructorProps,
} from "@core/@shared/domain/repository/search-params";
import { IProductRepository } from "@core/products/domain/product.repository";
import { ClutchId } from "@core/products/domain/clutch/clutch-id.vo";
import { Clutch } from "@core/products/domain/clutch/clutch.aggregate-root";
import { SearchResult } from "@core/@shared/domain/repository/search-result";
import { InvalidSearchParamsError } from "@core/@shared/domain/error/invalid-search-params.error";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { DressFilter } from "@core/products/domain/dress/dress.repository";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";

export type ClutchFilter = {
  model?: string;
  color?: string;
  rentPrice?: number;
  available?: boolean;
  period?: Period;
};

export class ClutchSearchParams extends SearchParams<ClutchFilter> {
  constructor(props: SearchParamsConstructorProps<ClutchFilter> = {}) {
    super(props);
  }

  get filter() {
    return this._filter;
  }

  set filter(value: ClutchFilter | null) {
    const _value =
      !value || (value as unknown) === "" || typeof value !== "object"
        ? null
        : value;

    const filter: ClutchFilter = {
      ...(_value?.color && { color: _value.color }),
      ...(_value?.model && { model: _value.model }),
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
    return new ClutchSearchParams({
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

export class ClutchSearchResult extends SearchResult<Clutch> {}

export interface IClutchRepository
  extends IProductRepository<
    ClutchId,
    Clutch,
    ClutchFilter,
    ClutchSearchParams,
    ClutchSearchResult
  > {}
