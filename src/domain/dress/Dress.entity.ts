import { AggregateRoot } from "@domain/@shared/aggregate-root";
import { Uuid } from "@domain/@shared/value-objects/uuid.vo";
import { DressId } from "@domain/dress/DressId.vo";
import { DressDescription } from "@domain/dress/DressDescription.vo";

export class Dress extends AggregateRoot<DressId> {
  private description: DressDescription;
  private readonly imageUrl: string;
  private readonly rentPrice: number;
  private isPickedUp: boolean;

  private constructor(
    id: Uuid,
    imageUrl: string,
    rentPrice: number,
    description: DressDescription,
  ) {
    super(id);
    this.imageUrl = imageUrl;
    this.rentPrice = rentPrice;
    this.description = description;
    this.isPickedUp = false;
    this.validate();
  }

  public static create({
    id,
    imageUrl,
    rentPrice,
    description,
  }: {
    id?: string;
    imageUrl: string;
    rentPrice: number;
    description: {
      color: string;
      model: string;
      fabric: string;
    };
  }): Dress {
    const newInstanceId = id ? DressId.create(id) : DressId.random();

    return new Dress(
      newInstanceId,
      imageUrl,
      rentPrice,
      new DressDescription(description),
    );
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

  private validate(): void {
    if (!this.imageUrl) throw new Error("Url da imagem inválida");
    if (!this.rentPrice) throw new Error("Preço inválido");
    if (this.rentPrice < 0) throw new Error("Preço não pode ser negativo");
  }
}
