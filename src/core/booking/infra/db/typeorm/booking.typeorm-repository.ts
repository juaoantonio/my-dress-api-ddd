import { IBookingRepository } from "@core/booking/domain/booking.repository";
import {
  Booking,
  BookingId,
} from "@core/booking/domain/booking.aggregate-root";
import { BookingModel } from "@core/booking/infra/db/typeorm/booking.model";
import { BaseTypeormRepository } from "@core/@shared/infra/db/typeorm/base.typeorm-repository";
import { Repository } from "typeorm";
import { BookingModelMapper } from "@core/booking/infra/db/typeorm/booking.model-mapper";
import { SearchParams } from "@core/@shared/domain/repository/search-params";
import { SearchResult } from "@core/@shared/domain/repository/search-result";

export class BookingTypeormRepository
  extends BaseTypeormRepository<BookingId, Booking, BookingModel>
  implements IBookingRepository
{
  sortableFields: string[];

  constructor(private readonly bookingRepository: Repository<BookingModel>) {
    super(bookingRepository, new BookingModelMapper(), BookingId);
  }

  getEntity(): { new (...args: any[]): Booking } {
    return Booking;
  }

  search(props: SearchParams<string>): Promise<SearchResult<Booking>> {
    return Promise.resolve(undefined);
  }
}
