import { AggregateRoot } from "../../../@shared/domain/aggregate-root";
import { DressId } from "./dress-id.vo";
import { DressValidatorFactory } from "./dress.validator";
import { IProduct } from "../product.interface";
import { DateVo } from "../../../@shared/domain/value-objects/date.vo";
import { Period } from "../../../@shared/domain/value-objects/period.vo";

type DressConstructorProps = {
  id: DressId;
  imageUrl: string;
  rentPrice: number;
  color: string;
  model: string;
  fabric: string;
  isPickedUp?: boolean;
  reservationPeriods?: Period[];
};

type DressCreateCommandProps = {
  id?: string;
  imageUrl: string;
  rentPrice: number;
  color: string;
  model: string;
  fabric: string;
};

export class Dress extends AggregateRoot<DressId> implements IProduct {
  private imageUrl: string;
  private rentPrice: number;
  private color: string;
  private model: string;
  private fabric: string;
  private isPickedUp: boolean;
  private reservationPeriods: Period[];

  constructor(props: DressConstructorProps) {
    super(props.id);
    this.imageUrl = props.imageUrl;
    this.rentPrice = props.rentPrice;
    this.color = props.color;
    this.model = props.model;
    this.fabric = props.fabric;
    this.isPickedUp = props.isPickedUp || false;
    this.reservationPeriods = props.reservationPeriods || [];
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

  getReservationPeriods(): Period[] {
    return this.reservationPeriods;
  }

  // Behavior Methods
  pickUp(): void {
    this.isPickedUp = true;
  }

  return(): void {
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

  isAvailableFor(date: DateVo): boolean {
    return this.reservationPeriods.every((period) => !period.contains(date));
  }

  addReservationPeriod(period: Period): void {
    this.reservationPeriods.push(period);
  }
}
