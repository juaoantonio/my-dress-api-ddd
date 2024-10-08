import { ClutchId } from "./clutch-id.vo";
import { ClutchValidatorFactory } from "./clutch.validator";
import {
  Product,
  ProductConstructorProps,
  ProductType,
} from "@core/products/domain/product";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";

export type ClutchConstructorProps = ProductConstructorProps<ClutchId>;

export type ClutchCreateCommandProps = {
  id?: string;
  imagePath: string;
  rentPrice: number;
  color: string;
  model: string;
  isPickedUp?: boolean;
  reservationPeriods?: {
    startDate: string;
    endDate: string;
  }[];
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
      reservationPeriods: props.reservationPeriods
        ? props.reservationPeriods.map(
            (raw) =>
              new Period({
                startDate: DateVo.create(raw.startDate),
                endDate: DateVo.create(raw.endDate),
              }),
          )
        : [],
      isPickedUp: props.isPickedUp || false,
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
