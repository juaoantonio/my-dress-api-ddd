import { Entity } from "@core/@shared/domain/entity";
import { Uuid } from "@core/@shared/domain/value-objects/uuid.vo";
import { BookingItemValidatorFactory } from "./booking-item.validator";
import { BookingClutchItemFakeBuilder } from "@core/booking/domain/entities/booking-clutch-item-fake.builder";
import { Clutch } from "@core/products/domain/clutch/clutch.aggregate-root";
import { Period } from "@core/@shared/domain/value-objects/period.vo";

export class BookingClutchItemId extends Uuid {}

export class BookingClutchItem extends Entity<BookingClutchItemId> {
  private productId: string;
  private rentPrice: number;
  private isCourtesy: boolean;
  private color: string;
  private model: string;
  private imagePath: string;

  constructor(props: {
    id: BookingClutchItemId;
    productId: string;
    rentPrice: number;
    color: string;
    model: string;
    imagePath: string;
    reservationPeriods?: Period[];
    isCourtesy?: boolean;
  }) {
    super(props.id);
    this.productId = props.productId;
    this.rentPrice = props.rentPrice;
    this._reservationPeriods = props.reservationPeriods ?? [];
    this.isCourtesy = props.isCourtesy ?? false;
    this.color = props.color;
    this.model = props.model;
    this.imagePath = props.imagePath;
  }

  private _reservationPeriods: Period[];

  get reservationPeriods(): Period[] {
    return this._reservationPeriods;
  }

  static fake(): typeof BookingClutchItemFakeBuilder {
    return BookingClutchItemFakeBuilder;
  }

  static create(props: {
    id?: BookingClutchItemId;
    productId: string;
    rentPrice: number;
    color: string;
    model: string;
    imagePath: string;
    reservationPeriods?: Period[];
    isCourtesy?: boolean;
  }): BookingClutchItem {
    const newBooking = new BookingClutchItem({
      id: props.id ?? BookingClutchItemId.random(),
      productId: props.productId,
      rentPrice: props.rentPrice,
      reservationPeriods: props.reservationPeriods,
      isCourtesy: props.isCourtesy,
      color: props.color,
      model: props.model,
      imagePath: props.imagePath,
    });
    newBooking.validate();
    return newBooking;
  }

  static from(clutch: Clutch): BookingClutchItem {
    return BookingClutchItem.create({
      productId: clutch.getId().getValue(),
      rentPrice: clutch.getRentPrice(),
      color: clutch.getColor(),
      model: clutch.getModel(),
      imagePath: clutch.getImagePath(),
    });
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

  public getColor(): string {
    return this.color;
  }

  public getModel(): string {
    return this.model;
  }

  public getImagePath(): string {
    return this.imagePath;
  }

  public setIsCourtesy(isCourtesy: boolean): void {
    this.isCourtesy = isCourtesy;
  }
}
