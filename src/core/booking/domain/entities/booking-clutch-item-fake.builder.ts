import { Chance } from "chance";
import {
  BookingClutchItem,
  BookingClutchItemId,
} from "@core/booking/domain/entities/booking-clutch-item.entity";

type PropOrFactory<T> = T | ((index: number) => T);

export class BookingClutchItemFakeBuilder<TBuild = any> {
  private countObjs: number;
  private chance: Chance.Chance;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = new Chance();
  }

  // Propriedades privadas com valores padrão
  private _id: PropOrFactory<BookingClutchItemId> = () =>
    BookingClutchItemId.random();

  // Getters para acessar as propriedades
  get id() {
    return this.getValue("id");
  }

  private _productId: PropOrFactory<string> = () => this.chance.guid();

  get productId() {
    return this.getValue("productId");
  }

  private _rentPrice: PropOrFactory<number> = () =>
    this.chance.floating({ min: 10, max: 500 });

  get rentPrice() {
    return this.getValue("rentPrice");
  }

  private _model: PropOrFactory<string> = () => this.chance.word();

  get model() {
    return this.getValue("model");
  }

  private _color: PropOrFactory<string> = () => this.chance.word();

  get color() {
    return this.getValue("color");
  }

  private _imagePath: PropOrFactory<string> = () => this.chance.word();

  get imagePath() {
    return this.getValue("imagePath");
  }

  private _isCourtesy: PropOrFactory<boolean> = () => this.chance.bool();

  get isCourtesy() {
    return this.getValue("isCourtesy");
  }

  // Métodos estáticos para iniciar o builder
  static aClutchItem() {
    return new BookingClutchItemFakeBuilder<BookingClutchItem>();
  }

  static theClutchItems(countObjs: number) {
    return new BookingClutchItemFakeBuilder<BookingClutchItem[]>(countObjs);
  }

  // Métodos "with" para personalizar as propriedades
  withId(valueOrFactory: PropOrFactory<BookingClutchItemId>) {
    this._id = valueOrFactory;
    return this;
  }

  withProductId(valueOrFactory: PropOrFactory<string>) {
    this._productId = valueOrFactory;
    return this;
  }

  withRentPrice(valueOrFactory: PropOrFactory<number>) {
    this._rentPrice = valueOrFactory;
    return this;
  }

  withModel(valueOrFactory: PropOrFactory<string>) {
    this._model = valueOrFactory;
    return this;
  }

  withColor(valueOrFactory: PropOrFactory<string>) {
    this._color = valueOrFactory;
    return this;
  }

  withImagePath(valueOrFactory: PropOrFactory<string>) {
    this._imagePath = valueOrFactory;
    return this;
  }

  withIsCourtesy(valueOrFactory: PropOrFactory<boolean>) {
    this._isCourtesy = valueOrFactory;
    return this;
  }

  // Método para construir a entidade ou entidades
  build(): TBuild {
    const clutchItems = Array.from({ length: this.countObjs }).map(
      (_, index) => {
        return new BookingClutchItem({
          id: this.callFactory(this._id, index),
          productId: this.callFactory(this._productId, index),
          rentPrice: this.callFactory(this._rentPrice, index),
          isCourtesy: this.callFactory(this._isCourtesy, index),
          color: this.callFactory(this._color, index),
          model: this.callFactory(this._model, index),
          imagePath: this.callFactory(this._imagePath, index),
        });
      },
    );

    return this.countObjs === 1 ? (clutchItems[0] as any) : clutchItems;
  }

  // Métodos auxiliares para obter valores das propriedades
  private getValue(prop: keyof BookingClutchItemFakeBuilder<any>) {
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
