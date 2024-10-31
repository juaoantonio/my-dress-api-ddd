import { Entity } from "@core/@shared/domain/entity";
import { Uuid } from "@core/@shared/domain/value-objects/uuid.vo";
import { BookingItemValidatorFactory } from "./booking-item.validator";
import { BookingClutchItemFakeBuilder } from "@core/booking/domain/entities/booking-clutch-item-fake.builder";

export class BookingClutchItemId extends Uuid {}

export class BookingClutchItem extends Entity<BookingClutchItemId> {
  private productId: string;
  private rentPrice: number;
  private isCourtesy: boolean;

  constructor(props: {
    id: BookingClutchItemId;
    productId: string;
    rentPrice: number;
    isCourtesy?: boolean;
  }) {
    super(props.id);
    this.productId = props.productId;
    this.rentPrice = props.rentPrice;
    this.isCourtesy = props.isCourtesy ?? false;
  }

  static fake(): typeof BookingClutchItemFakeBuilder {
    return BookingClutchItemFakeBuilder;
  }

  static create(props: {
    id?: BookingClutchItemId;
    productId: string;
    rentPrice: number;
    isCourtesy?: boolean;
  }): BookingClutchItem {
    const newBooking = new BookingClutchItem({
      id: props.id ?? BookingClutchItemId.random(),
      productId: props.productId,
      rentPrice: props.rentPrice,
      isCourtesy: props.isCourtesy,
    });
    newBooking.validate();
    return newBooking;
  }

  validate(fields?: string[]): void {
    const validator = BookingItemValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  public getRentPrice(): number {
    return this.rentPrice;
  }

  public getIsCourtesy(): boolean {
    return this.isCourtesy;
  }

  public getProductId(): string {
    return this.productId;
  }
}
