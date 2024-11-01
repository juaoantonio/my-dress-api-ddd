import {
  Booking,
  BookingId,
  BookingStatus,
} from "@core/booking/domain/booking.aggregate-root";
import { ISearchableRepository } from "@core/@shared/domain/repository/repository.interface";
import {
  SearchParams,
  SearchParamsConstructorProps,
} from "@core/@shared/domain/repository/search-params";
import { SearchResult } from "@core/@shared/domain/repository/search-result";

export type BookingFilter = {
  customerName?: string;
  eventDate?: string;
  expectedPickUpDate?: string;
  expectedReturnDate?: string;
  status?: BookingStatus;
};

export class BookingSearchParams extends SearchParams<BookingFilter> {
  constructor(props: SearchParamsConstructorProps<BookingFilter> = {}) {
    super(props);
  }

  get filter() {
    return this._filter;
  }

  set filter(value: BookingFilter | null) {
    const _value =
      !value || (value as unknown) === "" || typeof value !== "object"
        ? null
        : value;

    const filter: BookingFilter = {
      ...(_value?.customerName && { customerName: _value.customerName }),
      ...(_value?.eventDate && { eventDate: _value.eventDate }),
      ...(_value?.expectedPickUpDate && {
        expectedPickUpDate: _value.expectedPickUpDate,
      }),
      ...(_value?.expectedReturnDate && {
        expectedReturnDate: _value.expectedReturnDate,
      }),
      ...(_value?.status && { status: _value.status }),
    };
    this._filter = Object.values(filter).length === 0 ? null : filter;
  }

  static create(
    props: Omit<SearchParamsConstructorProps<BookingFilter>, "filter"> & {
      filter?: {
        customerName?: string;
        eventDate?: string;
        expectedPickUpDate?: string;
        expectedReturnDate?: string;
        status?: BookingStatus;
      };
    } = {},
  ) {
    return new BookingSearchParams({
      ...props,
      filter: {
        ...props.filter,
      },
    });
  }
}

export class BookingSearchResult extends SearchResult<Booking> {}

export interface IBookingRepository
  extends ISearchableRepository<
    BookingId,
    Booking,
    BookingFilter,
    BookingSearchParams,
    BookingSearchResult
  > {}
