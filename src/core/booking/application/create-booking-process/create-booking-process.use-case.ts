import { IsDateString, IsNotEmpty, IsString } from "class-validator";
import { IUseCase } from "@core/@shared/application/use-case.interface";
import { Booking } from "@core/booking/domain/booking.aggregate-root";
import { EntityValidationError } from "@core/@shared/domain/validators/validation.error";
import { IBookingRepository } from "@core/booking/domain/booking.repository";

export class CreateBookingProcessUseCase
  implements
    IUseCase<CreateBookingProcessInput, Promise<CreateBookingProcessOutput>>
{
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(
    input: CreateBookingProcessInput,
  ): Promise<CreateBookingProcessOutput> {
    const booking = Booking.create({
      customerName: input.customerName,
      eventDate: input.eventDate,
      expectedPickUpDate: input.expectedPickUpDate,
      expectedReturnDate: input.expectedReturnDate,
    });
    if (booking.notification.hasErrors()) {
      throw new EntityValidationError(booking.notification.toJSON());
    }
    await this.bookingRepository.save(booking);
    return {
      bookingId: booking.getId().getValue(),
    };
  }
}

export class CreateBookingProcessInput {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsDateString()
  eventDate: string;

  @IsDateString()
  expectedPickUpDate: string;

  @IsDateString()
  expectedReturnDate: string;
}

export class CreateBookingProcessOutput {
  bookingId: string;
}
