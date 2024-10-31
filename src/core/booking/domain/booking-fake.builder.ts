import { Chance } from "chance";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { Booking, BookingId, BookingStatus } from "./booking.aggregate-root";
import { BookingDressItem } from "./entities/booking-dress-item.entity";
import { BookingClutchItem } from "./entities/booking-clutch-item.entity";
import { BookingPeriod } from "@core/booking/domain/booking-period.vo";

type PropOrFactory<T> = T | ((index: number) => T);

export class BookingFakeBuilder<TBuild = any> {
  private countObjs: number;
  private chance: Chance.Chance;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = new Chance();
  }

  private _id: PropOrFactory<BookingId> = () => BookingId.random();

  get id() {
    return this.getValue("id");
  }

  private _customerName: PropOrFactory<string> = () =>
    this.chance.name({ nationality: "en" });

  get customerName() {
    return this.getValue("customerName");
  }

  private _eventDate: PropOrFactory<DateVo> = () =>
    DateVo.create(this.chance.date({ string: true }));

  get eventDate() {
    return this.getValue("eventDate");
  }

  private _expectedBookingPeriod: PropOrFactory<BookingPeriod> = () =>
    new BookingPeriod({
      pickUpDate: DateVo.create(this.chance.date({ string: true })),
      returnDate: DateVo.create(this.chance.date({ string: true })),
    });

  get expectedBookingPeriod() {
    return this.getValue("expectedBookingPeriod");
  }

  private _dresses: PropOrFactory<BookingDressItem[]>;

  get dresses() {
    return this.getValue("dresses");
  }

  private _clutches: PropOrFactory<BookingClutchItem[]>;

  get clutches() {
    return this.getValue("clutches");
  }

  private _status: PropOrFactory<BookingStatus> = () =>
    this.chance.pickone(Object.values(BookingStatus));

  get status() {
    return this.getValue("status");
  }

  private _amountPaid: PropOrFactory<number> = () =>
    this.chance.integer({ min: 0, max: 1000 });

  get amountPaid() {
    return this.getValue("amountPaid");
  }

  // Métodos estáticos para iniciar o builder
  static aBooking() {
    return new BookingFakeBuilder<Booking>();
  }

  static theBookings(countObjs: number) {
    return new BookingFakeBuilder<Booking[]>(countObjs);
  }

  // Métodos "with" para personalizar as propriedades
  withId(valueOrFactory: PropOrFactory<BookingId>) {
    this._id = valueOrFactory;
    return this;
  }

  withCustomerName(valueOrFactory: PropOrFactory<string>) {
    this._customerName = valueOrFactory;
    return this;
  }

  withEventDate(valueOrFactory: PropOrFactory<DateVo>) {
    this._eventDate = valueOrFactory;
    return this;
  }

  withExpectedBookingPeriod(valueOrFactory: PropOrFactory<BookingPeriod>) {
    this._expectedBookingPeriod = valueOrFactory;
    return this;
  }

  withDresses(valueOrFactory: PropOrFactory<BookingDressItem[]>) {
    this._dresses = valueOrFactory;
    return this;
  }

  withClutches(valueOrFactory: PropOrFactory<BookingClutchItem[]>) {
    this._clutches = valueOrFactory;
    return this;
  }

  withStatus(valueOrFactory: PropOrFactory<BookingStatus>) {
    this._status = valueOrFactory;
    return this;
  }

  withAmountPaid(valueOrFactory: PropOrFactory<number>) {
    this._amountPaid = valueOrFactory;
    return this;
  }

  // Método de construção
  build(): TBuild {
    const bookings = Array.from({ length: this.countObjs }).map((_, index) => {
      return new Booking({
        id: this.callFactory(this._id, index),
        customerName: this.callFactory(this._customerName, index),
        eventDate: this.callFactory(this._eventDate, index),
        expectedBookingPeriod: this.callFactory(
          this._expectedBookingPeriod,
          index,
        ),
        dresses: this.callFactory(this._dresses, index),
        clutches: this.callFactory(this._clutches, index),
        status: this.callFactory(this._status, index),
        amountPaid: this.callFactory(this._amountPaid, index),
      });
    });

    return this.countObjs === 1 ? (bookings[0] as any) : bookings;
  }

  private getValue(prop: keyof BookingFakeBuilder<any>) {
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
