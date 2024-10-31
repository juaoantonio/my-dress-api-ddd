import { IsUUID } from "class-validator";
import { IUseCase } from "@core/@shared/application/use-case.interface";
import { IBookingRepository } from "@core/booking/domain/booking.repository";
import {
  Booking,
  BookingId,
} from "@core/booking/domain/booking.aggregate-root";
import { EntityNotFoundError } from "@core/@shared/domain/error/entity-not-found.error";

export class InitBookingProcessUseCase
  implements
    IUseCase<InitBookingProcessInput, Promise<InitBookingProcessOutput>>
{
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(
    input: InitBookingProcessInput,
  ): Promise<InitBookingProcessOutput> {
    const bookingId = BookingId.create(input.bookingId);
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new EntityNotFoundError(bookingId, Booking);
    }
    booking.initBookingProcess();
    await this.bookingRepository.update(booking);
    return {
      bookingId: booking.getId().getValue(),
    };
  }
}

export class InitBookingProcessInput {
  @IsUUID("4")
  bookingId: string;
}

export class InitBookingProcessOutput {
  bookingId: string;
}
