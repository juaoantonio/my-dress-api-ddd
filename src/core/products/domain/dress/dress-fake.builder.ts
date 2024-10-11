import { Chance } from "chance";
import { Period } from "@core/@shared/domain/value-objects/period.vo";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { DressId } from "@core/products/domain/dress/dress-id.vo";
import { Dress } from "@core/products/domain/dress/dress.aggregate-root";

type PropOrFactory<T> = T | ((index: number) => T);

export class DressFakeBuilder<TBuild = any> {
  private countObjs: number;
  private chance: Chance.Chance;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = new Chance();
  }

  private _id: PropOrFactory<DressId> | undefined = () =>
    DressId.create(
      this.chance.guid({
        version: 4,
      }),
    );

  get id() {
    return this.getValue("id");
  }

  private _imagePath: PropOrFactory<string> = () => this.chance.url();

  get imagePath() {
    return this.getValue("imagePath");
  }

  private _rentPrice: PropOrFactory<number> = () =>
    this.chance.floating({ min: 10, max: 1000, fixed: 2 });

  get rentPrice() {
    return this.getValue("rentPrice");
  }

  private _color: PropOrFactory<string> = () => this.chance.word({ length: 5 });

  get color() {
    return this.getValue("color");
  }

  private _model: PropOrFactory<string> = () => this.chance.word({ length: 8 });

  get model() {
    return this.getValue("model");
  }

  private _fabric: PropOrFactory<string> = () =>
    this.chance.word({ length: 10 });

  get fabric() {
    return this.getValue("fabric");
  }

  private _isPickedUp: PropOrFactory<boolean> = () =>
    this.chance.bool({ likelihood: 70 });

  get isPickedUp() {
    return this.getValue("isPickedUp");
  }

  private _reservationPeriods: PropOrFactory<
    { endDate: Date | string; startDate: Date | string }[]
  > = () => {
    const count = this.chance.integer({ min: 0, max: 5 });
    return Array.from({ length: count }, () => ({
      startDate: this.chance.date({ string: true }),
      endDate: this.chance.date({ string: true }),
    }));
  };

  get reservationPeriods() {
    return this.getValue("reservationPeriods");
  }

  // Métodos estáticos para iniciar o builder
  static aDress() {
    return new DressFakeBuilder<Dress>();
  }

  static theDresses(countObjs: number) {
    return new DressFakeBuilder<Dress[]>(countObjs);
  }

  // Métodos "with" para personalizar as propriedades
  withId(valueOrFactory: PropOrFactory<DressId>) {
    this._id = valueOrFactory;
    return this;
  }

  withImagePath(valueOrFactory: PropOrFactory<string>) {
    this._imagePath = valueOrFactory;
    return this;
  }

  withRentPrice(valueOrFactory: PropOrFactory<number>) {
    this._rentPrice = valueOrFactory;
    return this;
  }

  withColor(valueOrFactory: PropOrFactory<string>) {
    this._color = valueOrFactory;
    return this;
  }

  withModel(valueOrFactory: PropOrFactory<string>) {
    this._model = valueOrFactory;
    return this;
  }

  withFabric(valueOrFactory: PropOrFactory<string>) {
    this._fabric = valueOrFactory;
    return this;
  }

  withIsPickedUp(valueOrFactory: PropOrFactory<boolean>) {
    this._isPickedUp = valueOrFactory;
    return this;
  }

  withReservationPeriods(
    valueOrFactory: PropOrFactory<
      { endDate: Date | string; startDate: Date | string }[]
    >,
  ) {
    this._reservationPeriods = valueOrFactory;
    return this;
  }

  withInvalidRentPrice(value?: number) {
    this._rentPrice =
      value ?? this.chance.floating({ min: -1000, max: -1, fixed: 2 });
    return this;
  }

  withInvalidColor(value?: string) {
    this._color = value ?? "";
    return this;
  }

  build(): TBuild {
    const dresses = Array.from({ length: this.countObjs }).map((_, index) => {
      const dress = new Dress({
        id: this._id ? this.callFactory(this._id, index) : DressId.random(),
        imagePath: this.callFactory(this._imagePath, index),
        rentPrice: this.callFactory(this._rentPrice, index),
        color: this.callFactory(this._color, index),
        model: this.callFactory(this._model, index),
        fabric: this.callFactory(this._fabric, index),
        reservationPeriods: this.callFactory(
          this._reservationPeriods,
          index,
        ).map(
          (raw) =>
            new Period({
              startDate: DateVo.create(raw.startDate),
              endDate: DateVo.create(raw.endDate),
            }),
        ),
        isPickedUp: this.callFactory(this._isPickedUp, index),
      });
      dress.validate();
      return dress;
    });

    return this.countObjs === 1 ? (dresses[0] as any) : dresses;
  }

  private getValue(prop: keyof DressFakeBuilder<any>) {
    const privateProp = `_${prop}` as keyof this;
    if (this[privateProp] === undefined) {
      throw new Error(
        `Propriedade ${prop} não possui uma factory definida. Use métodos 'with'.`,
      );
    }
    return this.callFactory(this[privateProp] as PropOrFactory<any>, 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === "function"
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
