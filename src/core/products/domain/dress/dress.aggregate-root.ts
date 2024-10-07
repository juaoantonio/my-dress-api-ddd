import { DressId } from "./dress-id.vo";
import { DressValidatorFactory } from "./dress.validator";
import {
  Product,
  ProductConstructorProps,
  ProductType,
} from "@core/products/domain/product";

type DressConstructorProps = ProductConstructorProps<DressId> & {
  fabric: string;
};

export class Dress extends Product<DressId> {
  private fabric: string;

  constructor(props: DressConstructorProps) {
    super(props, ProductType.DRESS);
    this.fabric = props.fabric;
    this.validate();
  }

  public static create(props: {
    id?: string;
    imageUrl: string;
    rentPrice: number;
    color: string;
    model: string;
    fabric: string;
  }): Dress {
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

  // Specific Getter for Dress
  getFabric(): string {
    return this.fabric;
  }

  changeFabric(newFabric: string): void {
    this.fabric = newFabric;
    this.validate(["fabric"]);
  }

  getName(): string {
    return `${this.color}, ${this.model}, ${this.fabric}`;
  }
}
