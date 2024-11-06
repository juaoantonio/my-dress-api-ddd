import { IsUUID } from "class-validator";
import { IUseCase } from "@core/@shared/application/use-case.interface";
import {
  Booking,
  BookingId,
} from "@core/booking/domain/booking.aggregate-root";
import { IBookingRepository } from "@core/booking/domain/booking.repository";
import { EntityNotFoundError } from "@core/@shared/domain/error/entity-not-found.error";
import { EntityValidationError } from "@core/@shared/domain/validators/validation.error";

export class StartBookingUseCase
  implements
    IUseCase<StartBookingUseCaseInput, Promise<StartBookingUseCaseOutput>>
{
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(
    input: StartBookingUseCaseInput,
  ): Promise<StartBookingUseCaseOutput> {
    const bookingId = BookingId.create(input.bookingId);
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new EntityNotFoundError(bookingId, Booking);
    }
    booking.start();
    if (booking.notification.hasErrors()) {
      throw new EntityValidationError(booking.notification.toJSON());
    }
    await this.bookingRepository.update(booking);
  }
}

export class StartBookingUseCaseInput {
  @IsUUID()
  bookingId: string;
}

export type StartBookingUseCaseOutput = void;
