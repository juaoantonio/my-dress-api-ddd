import { IUseCase } from "@core/@shared/application/use-case.interface";
import { IsArray, IsUUID } from "class-validator";
import { IBookingRepository } from "@core/booking/domain/booking.repository";
import { IDressRepository } from "@core/products/domain/dress/dress.repository";
import { IClutchRepository } from "@core/products/domain/clutch/clutch.repository";
import { DressId } from "@core/products/domain/dress/dress-id.vo";
import { ClutchId } from "@core/products/domain/clutch/clutch-id.vo";
import { BookingDressItem } from "@core/booking/domain/entities/booking-dress-item.entity";
import { BookingClutchItem } from "@core/booking/domain/entities/booking-clutch-item.entity";
import {
  Booking,
  BookingId,
} from "@core/booking/domain/booking.aggregate-root";
import { EntityNotFoundError } from "@core/@shared/domain/error/entity-not-found.error";
import { EntityValidationError } from "@core/@shared/domain/validators/validation.error";

export class AddBookingItemsUseCase
  implements IUseCase<AddBookingItemsInput, Promise<AddBookingItemsOutput>>
{
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly dressRepository: IDressRepository,
    private readonly clutchRepository: IClutchRepository,
  ) {}

  async execute(input: AddBookingItemsInput): Promise<AddBookingItemsOutput> {
    const bookingId = BookingId.create(input.bookingId);
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new EntityNotFoundError(bookingId, Booking);
    }
    const dressIds = input.dressIds.map((id) => DressId.create(id));
    const dresses = await this.dressRepository.findManyByIds(dressIds);
    const dressItems = dresses.map((dress) => BookingDressItem.from(dress));
    const clutchIds = input.clutchIds.map((id) => ClutchId.create(id));
    const clutches = await this.clutchRepository.findManyByIds(clutchIds);
    const clutchItems = clutches.map((clutch) =>
      BookingClutchItem.from(clutch),
    );
    booking.addManyItems([...dressItems, ...clutchItems]);
    if (booking.notification.hasErrors()) {
      throw new EntityValidationError(booking.notification.toJSON());
    }
    await this.bookingRepository.update(booking);
    return {
      bookingId: booking.getId().getValue(),
    };
  }
}

export class AddBookingItemsInput {
  @IsUUID("4")
  bookingId: string;

  @IsArray()
  @IsUUID("4", { each: true })
  dressIds: string[];

  @IsArray()
  @IsUUID("4", { each: true })
  clutchIds: string[];
}

export class AddBookingItemsOutput {
  bookingId: string;
}
