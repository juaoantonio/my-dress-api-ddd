import { IsUUID } from "class-validator";
import { IUseCase } from "@core/@shared/application/use-case.interface";
import {
  Booking,
  BookingId,
} from "@core/booking/domain/booking.aggregate-root";
import { IBookingRepository } from "@core/booking/domain/booking.repository";
import { EntityNotFoundError } from "@core/@shared/domain/error/entity-not-found.error";
import { EntityValidationError } from "@core/@shared/domain/validators/validation.error";

export class CancelBookingUseCase
  implements
    IUseCase<CancelBookingUseCaseInput, Promise<CancelBookingUseCaseOutput>>
{
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(
    input: CancelBookingUseCaseInput,
  ): Promise<CancelBookingUseCaseOutput> {
    const bookingId = BookingId.create(input.bookingId);
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new EntityNotFoundError(bookingId, Booking);
    }
    booking.cancel();
    if (booking.notification.hasErrors()) {
      throw new EntityValidationError(booking.notification.toJSON());
    }
    await this.bookingRepository.update(booking);
  }
}

export class CancelBookingUseCaseInput {
  @IsUUID()
  bookingId: string;
}

export type CancelBookingUseCaseOutput = void;
