import { ISearchableRepository } from "@core/@shared/domain/repository/repository.interface";
import {
  Appointment,
  AppointmentId,
} from "@core/appointment/domain/appointment.aggregate";
import { SearchResult } from "@core/@shared/domain/repository/search-result";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import {
  SearchParams,
  SearchParamsConstructorProps,
} from "@core/@shared/domain/repository/search-params";

export type AppointmentFilter = {
  appointmentDate?: DateVo;
  customerName?: string;
  includeAll?: boolean;
};

export class AppointmentSearchParams extends SearchParams<AppointmentFilter> {
  constructor(props: SearchParamsConstructorProps<AppointmentFilter> = {}) {
    super(props);
  }

  get filter() {
    return this._filter;
  }

  set filter(value: AppointmentFilter | null) {
    const _value =
      !value || (value as unknown) === "" || typeof value !== "object"
        ? null
        : value;

    const filter: AppointmentFilter = {
      ...(_value?.appointmentDate && {
        appointmentDate: _value.appointmentDate,
      }),
      ...(_value?.customerName && { customerName: _value.customerName }),
      ...(_value?.includeAll !== undefined && {
        includeAll: _value.includeAll,
      }),
    };
    this._filter = Object.values(filter).length === 0 ? null : filter;
  }

  static create(
    props: Omit<SearchParamsConstructorProps<AppointmentFilter>, "filter"> & {
      filter?: {
        appointmentDate?: string;
        customerName?: string;
        includeAll?: boolean;
      };
    } = {},
  ) {
    return new AppointmentSearchParams({
      ...props,
      filter: {
        ...props.filter,
        appointmentDate: props.filter?.appointmentDate
          ? DateVo.create(props.filter.appointmentDate)
          : undefined,
      },
    });
  }
}

export class AppointmentSearchResult extends SearchResult<Appointment> {}

export interface IAppointmentRepository
  extends ISearchableRepository<
    AppointmentId,
    Appointment,
    AppointmentFilter,
    AppointmentSearchParams,
    AppointmentSearchResult
  > {}
