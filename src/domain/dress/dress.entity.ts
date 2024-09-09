import { AggregateRoot } from "@domain/@shared/aggregate-root";
import { DressId } from "@domain/dress/dress-id.vo";
import { DressDescription } from "@domain/dress/dress-description.vo";
import { DressValidatorFactory } from "@domain/dress/dress.validator";
import { EntityValidationError } from "@domain/validators/validation.error";

type DressConstructorProps = {
  id?: DressId;
  imageUrl: string;
  rentPrice: number;
  description: DressDescription;
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
    this.isPickedUp = false;
    Dress.validate(this);
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

  static validate(entity: Dress): void {
    const validator = DressValidatorFactory.create();
    const isValid = validator.validate(entity);

    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

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
    Dress.validate(this);
  }

  changeImageUrl(newImageUrl: string): void {
    this.imageUrl = newImageUrl;
    Dress.validate(this);
  }

  changeDescription(newDescription: DressDescription): void {
    this.description = newDescription;
  }
}
