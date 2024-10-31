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

export class GetBookingUseCase
  implements IUseCase<GetBookingUseCaseInput, Promise<GetBookingUseCaseOutput>>
{
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(
    input: GetBookingUseCaseInput,
  ): Promise<GetBookingUseCaseOutput> {
    const bookingId = BookingId.create(input.id);
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new EntityNotFoundError(bookingId, Booking);
    }
    return BookingOutputMapper.toOutput(booking);
  }
}

export class GetBookingUseCaseInput {
  @IsUUID()
  id: string;
}

export type GetBookingUseCaseOutput = BookingOutput;
