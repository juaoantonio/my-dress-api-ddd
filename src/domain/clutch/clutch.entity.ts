import { AggregateRoot } from "@domain/@shared/aggregate-root";
import { ClutchId } from "@domain/clutch/clutch-id.vo";
import { ClutchValidatorFactory } from "@domain/clutch/clutch.validator";

export type ClutchConstructorProps = {
  id: ClutchId;
  imageUrl: string;
  rentPrice: number;
  color: string;
  model: string;
  isPickedUp?: boolean;
};

export type ClutchCreateCommandProps = {
  id?: string;
  imageUrl: string;
  rentPrice: number;
  color: string;
  model: string;
};

export class Clutch extends AggregateRoot<ClutchId> {
  private imageUrl: string;
  private rentPrice: number;
  private color: string;
  private model: string;
  private isPickedUp: boolean;

  constructor(props: ClutchConstructorProps) {
    super(props.id);
    this.imageUrl = props.imageUrl;
    this.rentPrice = props.rentPrice;
    this.color = props.color;
    this.model = props.model;
    this.isPickedUp = props.isPickedUp || false;

    this.validate();
  }

  static create(props: ClutchCreateCommandProps): Clutch {
    return new Clutch({
      id: props.id ? ClutchId.create(props.id) : ClutchId.random(),
      imageUrl: props.imageUrl,
      rentPrice: props.rentPrice,
      color: props.color,
      model: props.model,
    });
  }

  validate(fields?: string[]): void {
    const validator = ClutchValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  // Behavior Methods
  public pickUp(): void {
    this.isPickedUp = true;
  }

  public return(): void {
    this.isPickedUp = false;
  }

  // Getters

  public getImageUrl(): string {
    return this.imageUrl;
  }

  public getRentPrice(): number {
    return this.rentPrice;
  }

  public getColor(): string {
    return this.color;
  }

  public getModel(): string {
    return this.model;
  }

  public getName(): string {
    return `${this.color} ${this.model}`;
  }

  public getIsPickedUp(): boolean {
    return this.isPickedUp;
  }
}
