import { Chance } from "chance";
import {
  BookingDressItem,
  BookingDressItemId,
} from "@core/booking/domain/entities/booking-dress-item.entity";
import { Adjustment } from "@core/booking/domain/entities/vo/adjustment.vo";

type PropOrFactory<T> = T | ((index: number) => T);

export class BookingDressItemFakeBuilder<TBuild = any> {
  private countObjs: number;
  private chance: Chance.Chance;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = new Chance();
  }

  static aDressItem() {
    return new BookingDressItemFakeBuilder<BookingDressItem>();
  }

  static theDressItems(countObjs: number) {
    return new BookingDressItemFakeBuilder<BookingDressItem[]>(countObjs);
  }

  withId(valueOrFactory: PropOrFactory<BookingDressItemId>) {
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

  withIsCourtesy(valueOrFactory: PropOrFactory<boolean>) {
    this._isCourtesy = valueOrFactory;
    return this;
  }

  withAdjustments(valueOrFactory: PropOrFactory<Adjustment[]>) {
    this._adjustments = valueOrFactory;
    return this;
  }

  build(): TBuild {
    const dressItems = Array.from({ length: this.countObjs }).map(
      (_, index) => {
        return new BookingDressItem({
          id: this._id instanceof Function ? this._id(index) : this._id,
          productId:
            this._productId instanceof Function
              ? this._productId(index)
              : this._productId,
          rentPrice:
            this._rentPrice instanceof Function
              ? this._rentPrice(index)
              : this._rentPrice,
          isCourtesy:
            this._isCourtesy instanceof Function
              ? this._isCourtesy(index)
              : this._isCourtesy,
          adjustments:
            this._adjustments instanceof Function
              ? this._adjustments(index)
              : this._adjustments,
        });
      },
    );

    return this.countObjs === 1 ? (dressItems[0] as any) : dressItems;
  }

  private _id: PropOrFactory<BookingDressItemId> = () =>
    BookingDressItemId.random();

  private _productId: PropOrFactory<string> = () => this.chance.guid();

  private _rentPrice: PropOrFactory<number> = () =>
    this.chance.floating({ min: 10, max: 1000 });

  private _isCourtesy: PropOrFactory<boolean> = () => this.chance.bool();

  private _adjustments: PropOrFactory<Adjustment[]> = () => [
    new Adjustment("Length", "Shortened"),
  ];
}
