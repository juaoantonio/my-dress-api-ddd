import { AggregateRoot } from "@domain/@shared/aggregate-root";
import { ClutchId } from "@domain/products/clutch/clutch-id.vo";
import { ClutchValidatorFactory } from "@domain/products/clutch/clutch.validator";
import { IProduct } from "@domain/products/product.interface";

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

export class Clutch extends AggregateRoot<ClutchId> implements IProduct {
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

  public changeRentPrice(rentPrice: number): void {
    this.rentPrice = rentPrice;
    this.validate(["rentPrice"]);
  }

  public changeColor(color: string): void {
    this.color = color;
    this.validate(["color"]);
  }

  public changeModel(model: string): void {
    this.model = model;
    this.validate(["model"]);
  }

  changeImageUrl(imageUrl: string): void {
    this.imageUrl = imageUrl;
    this.validate(["imageUrl"]);
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
