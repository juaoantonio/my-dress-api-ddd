import { IUseCase } from "@core/@shared/application/use-case.interface";
import { IBookingRepository } from "@core/booking/domain/booking.repository";
import {
  Booking,
  BookingId,
} from "@core/booking/domain/booking.aggregate-root";
import { EntityNotFoundError } from "@core/@shared/domain/error/entity-not-found.error";
import { IsUUID } from "class-validator";
import {
  BookingOutput,
  BookingOutputMapper,
} from "@core/booking/application/common/booking.output-mapper";
import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import { UrlPresignerService } from "@core/@shared/application/url-presigner.service";
import { BookingDressItem } from "@core/booking/domain/entities/booking-dress-item.entity";
import { BookingClutchItem } from "@core/booking/domain/entities/booking-clutch-item.entity";

export class GetBookingUseCase
  implements IUseCase<GetBookingUseCaseInput, Promise<GetBookingUseCaseOutput>>
{
  readonly urlPresignerService: UrlPresignerService;

  constructor(
    private readonly bookingRepository: IBookingRepository,
    readonly imageStorageService: IImageStorageService,
  ) {
    this.urlPresignerService = new UrlPresignerService(imageStorageService);
  }

  async execute(
    input: GetBookingUseCaseInput,
  ): Promise<GetBookingUseCaseOutput> {
    const bookingId = BookingId.create(input.id);
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new EntityNotFoundError(bookingId, Booking);
    }
    const dresses = await this.urlPresignerService.signMany<BookingDressItem>(
      booking.getDresses(),
      "imagePath" as keyof BookingDressItem,
    );
    const clutches = await this.urlPresignerService.signMany<BookingClutchItem>(
      booking.getClutches(),
      "imagePath" as keyof BookingClutchItem,
    );
    // @ts-ignore
    booking.dresses = dresses;
    // @ts-ignore
    booking.clutches = clutches;
    return BookingOutputMapper.toOutput(booking);
  }
}

export class GetBookingUseCaseInput {
  @IsUUID()
  id: string;
}

export type GetBookingUseCaseOutput = BookingOutput;
