import { IUseCase } from "@core/@shared/application/use-case.interface";
import {
  BookingSearchParams,
  IBookingRepository,
} from "@core/booking/domain/booking.repository";
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";
import {
  PaginationOutput,
  PaginationOutputMapper,
} from "@core/@shared/application/pagination-output";
import {
  BookingOutput,
  BookingOutputMapper,
} from "@core/booking/application/common/booking.output-mapper";
import { SortDirection } from "@core/@shared/domain/repository/search-params";
import { BookingStatus } from "@core/booking/domain/booking.aggregate-root";

export class GetPaginatedBookingsUseCase
  implements
    IUseCase<GetPaginatedBookingsInput, Promise<GetPaginatedBookingsOutput>>
{
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(
    input: GetPaginatedBookingsInput,
  ): Promise<GetPaginatedBookingsOutput> {
    const searchParams = BookingSearchParams.create({
      page: input.page,
      perPage: input.limit,
      sortDir: input.sortDir,
      filter: {
        customerName: input.customerName,
        eventDate: input.eventDate,
        expectedPickUpDate: input.expectedPickUpDate,
        expectedReturnDate: input.expectedReturnDate,
        status: input.status,
      },
    });
    const result = await this.bookingRepository.search(searchParams);
    const bookingsOutput = BookingOutputMapper.toOutputMany(result.items);
    return PaginationOutputMapper.toOutput(bookingsOutput, result);
  }
}

export class GetPaginatedBookingsInput {
  @IsPositive()
  page: number;

  @IsPositive()
  limit: number;

  @IsEnum(["asc", "desc"])
  @IsOptional()
  sortDir?: SortDirection;

  @IsString()
  @IsOptional()
  customerName?: string;

  @IsDateString()
  @IsOptional()
  eventDate?: string;

  @IsDateString()
  @IsOptional()
  expectedPickUpDate?: string;

  @IsDateString()
  @IsOptional()
  expectedReturnDate?: string;

  @IsEnum(BookingStatus)
  status?: BookingStatus;
}

export type GetPaginatedBookingsOutput = PaginationOutput<BookingOutput>;
