import { Entity } from "@domain/@shared/entity";
import { Uuid } from "@domain/@shared/value-objects/uuid.vo";

export class BookingItemId extends Uuid {}

export class BookingItem extends Entity<BookingItemId> {
  private productId: string;
  private type: "dress" | "clutch";
  private rentPrice: number;
  private adjustments: string[];

  constructor(props: {
    id: BookingItemId;
    productId: string;
    type: "dress" | "clutch";
    rentPrice: number;
    adjustments?: string[];
  }) {
    super(props.id);
    this.productId = props.productId;
    this.type = props.type;
    this.rentPrice = props.rentPrice;
    this.adjustments = props.adjustments ?? [];
  }

  public getType(): "dress" | "clutch" {
    return this.type;
  }

  public getRentPrice(): number {
    return this.rentPrice;
  }

  public getAdjustments(): string[] {
    return this.adjustments;
  }

  public addAdjustment(adjustment: string): void {
    this.adjustments.push(adjustment);
  }
}
