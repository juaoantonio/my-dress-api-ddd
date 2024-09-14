import { AggregateRoot } from "@domain/@shared/aggregate-root";
import { DressId } from "@domain/dress/dress-id.vo";
import { DressValidatorFactory } from "@domain/dress/dress.validator";

type DressConstructorProps = {
  id?: DressId;
  imageUrl: string;
  rentPrice: number;
  color: string;
  model: string;
  fabric: string;
  isPickedUp?: boolean;
};

type DressCreateCommandProps = {
  id?: string;
  imageUrl: string;
  rentPrice: number;
  color: string;
  model: string;
  fabric: string;
};

export class Dress extends AggregateRoot<DressId> {
  private imageUrl: string;
  private rentPrice: number;
  private color: string;
  private model: string;
  private fabric: string;
  private isPickedUp: boolean;

  constructor(props: DressConstructorProps) {
    super(props.id ? props.id : DressId.random());
    this.imageUrl = props.imageUrl;
    this.rentPrice = props.rentPrice;
    this.color = props.color;
    this.model = props.model;
    this.fabric = props.fabric;
    this.isPickedUp = props.isPickedUp || false;
    this.validate();
  }

  public static create(props: DressCreateCommandProps): Dress {
    const newInstanceId = props.id
      ? DressId.create(props.id)
      : DressId.random();

    return new Dress({
      id: newInstanceId,
      imageUrl: props.imageUrl,
      rentPrice: props.rentPrice,
      color: props.color,
      model: props.model,
      fabric: props.fabric,
    });
  }

  validate(fields?: string[]): void {
    const validator = DressValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  // Getters
  getName(): string {
    return `${this.color}, ${this.model}, ${this.fabric}`;
  }

  getModel(): string {
    return this.model;
  }

  getColor(): string {
    return this.color;
  }

  getFabric(): string {
    return this.fabric;
  }

  getImageUrl(): string {
    return this.imageUrl;
  }

  getRentPrice(): number {
    return this.rentPrice;
  }

  // Behavior Methods
  pickUp(): void {
    this.isPickedUp = true;
  }

  returned(): void {
    this.isPickedUp = false;
  }

  getIsPickedUp(): boolean {
    return this.isPickedUp;
  }

  changeRentPrice(newRentPrice: number): void {
    this.rentPrice = newRentPrice;
    this.validate(["rentPrice"]);
  }

  changeImageUrl(newImageUrl: string): void {
    this.imageUrl = newImageUrl;
    this.validate(["imageUrl"]);
  }

  changeColor(newColor: string): void {
    this.color = newColor;
    this.validate(["color"]);
  }

  changeModel(newModel: string): void {
    this.model = newModel;
    this.validate(["model"]);
  }

  changeFabric(newFabric: string): void {
    this.fabric = newFabric;
    this.validate(["fabric"]);
  }
}
