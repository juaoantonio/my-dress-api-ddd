import { IUseCase } from "@core/@shared/application/use-case.interface";
import {
  BookingSearchParams,
  IBookingRepository,
} from "@core/booking/domain/booking.repository";
import {
  IsBoolean,
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
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { UrlPresignerService } from "@core/@shared/application/url-presigner.service";
import { BookingDressItem } from "@core/booking/domain/entities/booking-dress-item.entity";
import { BookingClutchItem } from "@core/booking/domain/entities/booking-clutch-item.entity";

export class GetPaginatedBookingsUseCase
  implements
    IUseCase<GetPaginatedBookingsInput, Promise<GetPaginatedBookingsOutput>>
{
  readonly urlPresignerService: UrlPresignerService;

  constructor(
    private readonly bookingRepository: IBookingRepository,
    readonly imageStorageService: IImageStorageService,
  ) {
    this.urlPresignerService = new UrlPresignerService(imageStorageService);
  }

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
    let result = await this.bookingRepository.search(searchParams);
    for (const booking of result.items) {
      const dresses = booking.getDresses();
      const clutches = booking.getClutches();
      const dressesWithPreSignedUrl =
        await this.urlPresignerService.signMany<BookingDressItem>(
          dresses,
          "imagePath" as keyof BookingDressItem,
        );
      const clutchesWithPreSignedUrl =
        await this.urlPresignerService.signMany<BookingClutchItem>(
          clutches,
          "imagePath" as keyof BookingClutchItem,
        );
      // @ts-ignore
      booking.dresses = dressesWithPreSignedUrl;
      // @ts-ignore
      booking.clutches = clutchesWithPreSignedUrl;
    }

    const bookingsOutput = BookingOutputMapper.toOutputMany(result.items);
    return PaginationOutputMapper.toOutput(bookingsOutput, result);
  }
}

export class GetPaginatedBookingsInput {
  @IsPositive()
  @IsOptional()
  page?: number;

  @IsPositive()
  @IsOptional()
  limit?: number;

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
  @IsOptional()
  status?: BookingStatus;

  @IsBoolean()
  @IsOptional()
  includeArchived?: boolean;
}

export type GetPaginatedBookingsOutput = PaginationOutput<BookingOutput>;
