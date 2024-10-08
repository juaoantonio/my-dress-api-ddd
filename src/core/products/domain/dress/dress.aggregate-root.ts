import { DressId } from "./dress-id.vo";
import { DressValidatorFactory } from "./dress.validator";
import {
  Product,
  ProductConstructorProps,
  ProductType,
} from "@core/products/domain/product";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { Period } from "@core/@shared/domain/value-objects/period.vo";

type DressConstructorProps = ProductConstructorProps<DressId> & {
  fabric: string;
};

type DressCreateCommandProps = {
  id?: string;
  imageUrl: string;
  rentPrice: number;
  color: string;
  model: string;
  fabric: string;
  isPickedUp?: boolean;
  reservationPeriods?: {
    startDate: string;
    endDate: string;
  }[];
};

export class Dress extends Product<DressId> {
  private fabric: string;

  constructor(props: DressConstructorProps) {
    super(props, ProductType.DRESS);
    this.fabric = props.fabric;
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
      reservationPeriods: props.reservationPeriods.map(
        (raw) =>
          new Period({
            startDate: DateVo.create(raw.startDate),
            endDate: DateVo.create(raw.endDate),
          }),
      ),
      isPickedUp: props.isPickedUp || false,
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
