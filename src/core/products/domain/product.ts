import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { AggregateRoot } from "@core/@shared/domain/aggregate-root";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { Uuid } from "@core/@shared/domain/value-objects/uuid.vo";

export type ProductConstructorProps<T> = {
  id: T;
  imageUrl: string;
  rentPrice: number;
  color: string;
  model: string;
  reservationPeriods?: Period[];
  isPickedUp?: boolean;
};

export enum ProductType {
  DRESS = "dress",
  CLUTCH = "clutch",
}

export abstract class ProductId extends Uuid {}

export abstract class Product<T extends ProductId> extends AggregateRoot<T> {
  protected imageUrl: string;
  protected rentPrice: number;
  protected color: string;
  protected model: string;
  protected isPickedUp: boolean = false;
  protected reservationPeriods: Period[] = [];
  protected readonly type: ProductType;

  protected constructor(props: ProductConstructorProps<T>, type: ProductType) {
    super(props.id);
    this.imageUrl = props.imageUrl;
    this.rentPrice = props.rentPrice;
    this.color = props.color;
    this.model = props.model;
    this.reservationPeriods = props.reservationPeriods || [];
    this.isPickedUp = props.isPickedUp || false;
    this.type = type;
    this.validate();
  }

  abstract validate(fields?: string[]): void;

  // Getters
  public getImageUrl(): string {
    return this.imageUrl;
  }

  public getRentPrice(): number {
    return this.rentPrice;
  }

  public getColor(): string {
    return this.color;
  }

  public getModel(): string {
    return this.model;
  }

  public getIsPickedUp(): boolean {
    return this.isPickedUp;
  }

  public getReservationPeriods(): Period[] {
    return this.reservationPeriods;
  }

  public getType(): ProductType {
    return this.type;
  }

  public abstract getName(): string;

  // Behavior Methods
  public pickUp(): void {
    this.isPickedUp = true;
  }

  public return(): void {
    this.isPickedUp = false;
  }

  public changeRentPrice(newRentPrice: number): void {
    this.rentPrice = newRentPrice;
    this.validate(["rentPrice"]);
  }

  public changeColor(newColor: string): void {
    this.color = newColor;
    this.validate(["color"]);
  }

  public changeModel(newModel: string): void {
    this.model = newModel;
    this.validate(["model"]);
  }

  public changeImageUrl(newImageUrl: string): void {
    this.imageUrl = newImageUrl;
    this.validate(["imageUrl"]);
  }

  public isAvailableFor(date: DateVo): boolean {
    return this.reservationPeriods.every((period) => !period.contains(date));
  }

  public addReservationPeriod(period: Period): void {
    this.reservationPeriods.push(period);
  }
}
