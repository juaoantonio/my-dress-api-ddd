import { ClutchId } from "./clutch-id.vo";
import { ClutchValidatorFactory } from "./clutch.validator";
import {
  Product,
  ProductConstructorProps,
  ProductType,
} from "@core/products/domain/product";

export type ClutchConstructorProps = ProductConstructorProps<ClutchId>;
export type ClutchCreateCommandProps = {
  id?: string;
  imageUrl: string;
  rentPrice: number;
  color: string;
  model: string;
};

export class Clutch extends Product<ClutchId> {
  constructor(props: ClutchConstructorProps) {
    super(props, ProductType.CLUTCH);
    this.validate();
  }

  public static create(props: ClutchCreateCommandProps): Clutch {
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

  getName(): string {
    return `${this.color} ${this.model}`;
  }
}
