import { IUseCase } from "@core/@shared/application/use-case.interface";
import { IsArray, IsUUID } from "class-validator";
import {
  Booking,
  BookingId,
} from "@core/booking/domain/booking.aggregate-root";
import { IBookingRepository } from "@core/booking/domain/booking.repository";
import { EntityNotFoundError } from "@core/@shared/domain/error/entity-not-found.error";
import { DressId } from "@core/products/domain/dress/dress-id.vo";
import { IDressRepository } from "@core/products/domain/dress/dress.repository";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";

export class AddAdjustmentsUseCase
  implements IUseCase<AddAdjustmentsInput, Promise<AddAdjustmentsOutput>>
{
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly dressRepository: IDressRepository,
  ) {}

  async execute(input: AddAdjustmentsInput): Promise<AddAdjustmentsOutput> {
    const bookingId = BookingId.create(input.bookingId);
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new EntityNotFoundError(bookingId, Booking);
    }
    const dressIds = input.adjustments.map((adjustment) =>
      DressId.create(adjustment.dressId),
    );
    const foundDresses = await this.dressRepository.existsById(dressIds);
    if (foundDresses.notExists.length > 0) {
      throw new EntityNotFoundError(foundDresses.notExists, Dress);
    }
    booking.getDresses().forEach((dress) => {
      dress.clearAdjustments();
      input.adjustments.forEach((adjustment) => {
        if (dress.getProductId() === adjustment.dressId) {
          dress.addAdjustment({
            label: adjustment.label,
            description: adjustment.description,
          });
        }
      });
    });
    await this.bookingRepository.update(booking);
    return {
      bookingId: booking.getId().getValue(),
    };
  }
}

export class AddAdjustmentsInput {
  @IsUUID("4")
  bookingId: string;

  @IsArray()
  adjustments: AdjustmentInput[];
}

export class AddAdjustmentsOutput {
  bookingId: string;
}

export class AdjustmentInput {
  label: string;
  description: string;
  dressId: string;
}
