import {
  BookingFilter,
  BookingSearchParams,
  BookingSearchResult,
  IBookingRepository,
} from "@core/booking/domain/booking.repository";
import {
  Booking,
  BookingId,
} from "@core/booking/domain/booking.aggregate-root";
import { BookingModel } from "@core/booking/infra/db/typeorm/booking.model";
import { BaseTypeormRepository } from "@core/@shared/infra/db/typeorm/base.typeorm-repository";
import {
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  Not,
  Repository,
} from "typeorm";
import { BookingModelMapper } from "@core/booking/infra/db/typeorm/booking.model-mapper";

export class BookingTypeormRepository
  extends BaseTypeormRepository<
    BookingId,
    Booking,
    BookingModel,
    BookingFilter,
    BookingSearchParams,
    BookingSearchResult
  >
  implements IBookingRepository
{
  sortableFields: string[] = ["eventDate", "expectedPickUpDate", "status"];

  constructor(private readonly bookingRepository: Repository<BookingModel>) {
    super(bookingRepository, new BookingModelMapper(), BookingId);
  }

  getEntity(): { new (...args: any[]): Booking } {
    return Booking;
  }

  async search(props: BookingSearchParams): Promise<BookingSearchResult> {
    const { page, perPage, sort, sortDir, filter } = props;
    const offset = (page - 1) * perPage;
    const limit = perPage;
    const whereClause: FindOptionsWhere<BookingModel> = {};
    if (filter?.customerName) {
      whereClause.customerName = filter.customerName;
    }
    if (filter?.eventDate) {
      whereClause.eventDate = new Date(filter.eventDate);
    }
    if (filter?.expectedPickUpDate) {
      whereClause.expectedPickUpDate = new Date(filter.expectedPickUpDate);
    }
    if (filter?.expectedReturnDate) {
      whereClause.expectedReturnDate = new Date(filter.expectedReturnDate);
    }
    if (filter?.status) {
      whereClause.status = filter.status;
    }
    const order: FindOptionsOrder<BookingModel> = {};
    if (sort && this.sortableFields.includes(sort)) {
      order[sort] = sortDir;
    } else {
      order.expectedPickUpDate = "ASC";
    }
    const [models, count] = await this.modelRepository.findAndCount({
      where: {
        ...whereClause,
        status: Not(In(["CANCELED", "COMPLETED"])),
      },
      order,
      skip: offset,
      take: limit,
    });
    const items = models.map((model) => this.modelMapper.toEntity(model));
    return new BookingSearchResult({
      items,
      total: count,
      currentPage: page,
      perPage,
    });
  }
}
