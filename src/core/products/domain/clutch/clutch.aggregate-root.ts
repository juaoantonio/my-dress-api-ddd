import { ClutchId } from "./clutch-id.vo";
import { ClutchValidatorFactory } from "./clutch.validator";
import {
  Product,
  ProductConstructorProps,
  ProductType,
} from "@core/products/domain/product";
import { ClutchFakeBuilder } from "@core/products/domain/clutch/clutch-fake.builder";

export type ClutchConstructorProps = ProductConstructorProps<ClutchId>;

export type ClutchCreateCommandProps = {
  id?: string;
  imagePath: string;
  rentPrice: number;
  color: string;
  model: string;
  isPickedUp?: boolean;
};

export class Clutch extends Product<ClutchId> {
  constructor(props: ClutchConstructorProps) {
    super(props, ProductType.CLUTCH);
    this.validate();
  }

  public static create(props: ClutchCreateCommandProps): Clutch {
    return new Clutch({
      id: props.id ? ClutchId.create(props.id) : ClutchId.random(),
      imagePath: props.imagePath,
      rentPrice: props.rentPrice,
      color: props.color,
      model: props.model,
      isPickedUp: props.isPickedUp || false,
    });
  }

  static fake(): typeof ClutchFakeBuilder {
    return ClutchFakeBuilder;
  }

  validate(fields?: string[]): void {
    const validator = ClutchValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  getName(): string {
    return `${this.color} ${this.model}`;
  }
}
