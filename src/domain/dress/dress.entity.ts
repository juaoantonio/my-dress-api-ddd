import { AggregateRoot } from "@domain/@shared/aggregate-root";
import { DressId } from "@domain/dress/dress-id.vo";
import { DressDescription } from "@domain/dress/dress-description.vo";
import { DressValidatorFactory } from "@domain/dress/dress.validator";

type DressConstructorProps = {
  id?: DressId;
  imageUrl: string;
  rentPrice: number;
  description: DressDescription;
  isPickedUp?: boolean;
};

type DressCreateCommandProps = {
  id?: string;
  imageUrl: string;
  rentPrice: number;
  description: {
    color: string;
    model: string;
    fabric: string;
  };
};

export class Dress extends AggregateRoot<DressId> {
  private description: DressDescription;
  private imageUrl: string;
  private rentPrice: number;
  private isPickedUp: boolean;

  constructor(props: DressConstructorProps) {
    super(props.id ? props.id : DressId.random());
    this.imageUrl = props.imageUrl;
    this.rentPrice = props.rentPrice;
    this.description = props.description;
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
      description: new DressDescription(props.description),
    });
  }

  validate(fields?: string[]): void {
    const validator = DressValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  // Getters
  getName(): string {
    return this.description.toString();
  }

  getModel(): string {
    return this.description.getModel();
  }

  getColor(): string {
    return this.description.getColor();
  }

  getFabric(): string {
    return this.description.getFabric();
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

  changeDescription({
    color,
    model,
    fabric,
  }: {
    color: string;
    model: string;
    fabric: string;
  }): void {
    this.description = new DressDescription({ color, model, fabric });
  }
}
