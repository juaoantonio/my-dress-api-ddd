import { Entity } from "@core/@shared/domain/entity";
import { Uuid } from "@core/@shared/domain/value-objects/uuid.vo";
import { Adjustment } from "./vo/adjustment.vo";
import { BookingItemValidatorFactory } from "./booking-item.validator";
import { BookingDressItemFakeBuilder } from "@core/booking/domain/entities/booking-dress-item-fake.builder";

export class BookingDressItemId extends Uuid {}

export class BookingDressItem extends Entity<BookingDressItemId> {
  private productId: string;
  private rentPrice: number;
  private adjustments: Set<Adjustment>;
  private isCourtesy: boolean;

  constructor(props: {
    id: BookingDressItemId;
    productId: string;
    rentPrice: number;
    adjustments?: Adjustment[];
    isCourtesy?: boolean;
  }) {
    super(props.id);
    this.productId = props.productId;
    this.rentPrice = props.rentPrice;
    this.adjustments = new Set(props.adjustments ?? []);
    this.isCourtesy = props.isCourtesy ?? false;
  }

  static fake(): typeof BookingDressItemFakeBuilder {
    return BookingDressItemFakeBuilder;
  }

  static create(props: {
    id?: BookingDressItemId;
    productId: string;
    rentPrice: number;
    adjustments?: Adjustment[];
    isCourtesy?: boolean;
  }): BookingDressItem {
    const newBooking = new BookingDressItem({
      id: props.id ?? BookingDressItemId.random(),
      productId: props.productId,
      rentPrice: props.rentPrice,
      adjustments: props.adjustments,
      isCourtesy: props.isCourtesy,
    });
    newBooking.validate();
    return newBooking;
  }

  validate(fields?: string[]): void {
    const validator = BookingItemValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  // Behavior methods
  public addAdjustment(adjustment: {
    label: string;
    description: string;
  }): void {
    this.adjustments.add(
      new Adjustment(adjustment.label, adjustment.description),
    );
    this.validate(["adjustments"]);
  }

  public addManyAdjustments(
    adjustments: {
      label: string;
      description: string;
    }[],
  ): void {
    adjustments.forEach((adjustment) => {
      this.addAdjustment(adjustment);
    });
    this.validate(["adjustments"]);
  }

  public removeAdjustment(adjustment: {
    label: string;
    description: string;
  }): void {
    const adjustmentToRemove = new Adjustment(
      adjustment.label,
      adjustment.description,
    );
    this.adjustments.forEach((currentAdjustment) => {
      if (currentAdjustment.equals(adjustmentToRemove)) {
        this.adjustments.delete(currentAdjustment);
      }
    });
  }

  public clearAdjustments(): void {
    this.adjustments.clear();
  }

  public getRentPrice(): number {
    return this.rentPrice;
  }

  public getAdjustments(): Adjustment[] {
    return Array.from(this.adjustments);
  }

  public getIsCourtesy(): boolean {
    return this.isCourtesy;
  }

  public getProductId(): string {
    return this.productId;
  }
}