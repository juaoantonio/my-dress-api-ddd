import { Entity } from "../../../@shared/domain/entity";
import { Uuid } from "../../../@shared/domain/value-objects/uuid.vo";
import { Adjustment } from "./vo/adjustment.vo";
import { BookingItemValidatorFactory } from "./booking-item.validator";

export class BookingItemId extends Uuid {}

export class BookingItem extends Entity<BookingItemId> {
  private productId: string;
  private type: "dress" | "clutch";
  private rentPrice: number;
  private adjustments: Set<Adjustment>;
  private isCourtesy: boolean;

  constructor(props: {
    id: BookingItemId;
    productId: string;
    type: "dress" | "clutch";
    rentPrice: number;
    adjustments?: Adjustment[];
    isCourtesy?: boolean;
  }) {
    super(props.id);
    this.productId = props.productId;
    this.type = props.type;
    this.rentPrice = props.rentPrice;
    this.adjustments = new Set(props.adjustments ?? []);
    this.isCourtesy = props.isCourtesy ?? false;
  }

  static create(props: {
    id?: BookingItemId;
    productId: string;
    type: "dress" | "clutch";
    rentPrice: number;
    adjustments?: Adjustment[];
    isCourtesy?: boolean;
  }): BookingItem {
    const newBooking = new BookingItem({
      id: props.id ?? BookingItemId.random(),
      productId: props.productId,
      type: props.type,
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

  // Getters
  public getType(): "dress" | "clutch" {
    return this.type;
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
}
