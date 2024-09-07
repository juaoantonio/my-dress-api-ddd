import { AggregateRoot } from "@domain/@shared/aggregate-root";
import { DressId } from "@domain/dress/dress-id.vo";
import { DressDescription } from "@domain/dress/dress-description.vo";

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

  getName(): string {
    return this.description.toString();
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
    this.validate();
  }

  changeImageUrl(newImageUrl: string): void {
    this.imageUrl = newImageUrl;
    this.validate();
  }

  changeDescription(newDescription: DressDescription): void {
    this.description = newDescription;
  }

  private validate(): void {
    if (!this.imageUrl) throw new Error("Url da imagem inválida");
    if (!this.rentPrice && this.rentPrice != 0)
      throw new Error("Preço inválido");
    if (this.rentPrice < 0) throw new Error("Preço não pode ser negativo");
  }
}
