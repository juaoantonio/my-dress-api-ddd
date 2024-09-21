import { BookingPeriod } from "@domain/booking/booking-period.vo";
import { AggregateRoot } from "@domain/@shared/aggregate-root";
import { Uuid } from "@domain/@shared/value-objects/uuid.vo";
import { DateVo } from "@domain/booking/date.vo";
import { BookingItem } from "@domain/booking/entities/booking-item.entity";
import { BookingValidatorFactory } from "@domain/booking/booking.validator";

export enum BookingPaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
}

export enum BookingStatus {
  PAYMENT_PENDING = "PAYMENT_PENDING",
  READY = "READY",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export type BookingConstructorProps = {
  id: BookingId;
  customerId: string;
  eventDate: DateVo;
  expectedBookingPeriod: BookingPeriod;
  bookingPeriod?: BookingPeriod;
  items: BookingItem[];
  paymentStatus?: BookingPaymentStatus;
  status?: BookingStatus;
  amountPaid?: number;
};

export type BookingCreateCommandProps = {
  id?: string;
  customerId: string;
  eventDate: string;
  expectedPickUpDate: string;
  expectedReturnDate: string;
  pickUpDate?: string;
  returnDate?: string;
  items: BookingItem[];
  paymentStatus?: BookingPaymentStatus;
  status?: BookingStatus;
  amountPaid?: number;
};

export class BookingId extends Uuid {}

export class Booking extends AggregateRoot<BookingId> {
  private customerId: string;
  private eventDate: DateVo;
  private expectedBookingPeriod: BookingPeriod;
  private bookingPeriod?: BookingPeriod;
  private items: BookingItem[] = [];
  private paymentStatus: BookingPaymentStatus;
  private status: BookingStatus;
  private amountPaid: number = 0;
  private totalBookingPrice: number = 0;

  constructor(props: BookingConstructorProps) {
    super(props.id);
    this.customerId = props.customerId;
    this.eventDate = props.eventDate;
    this.expectedBookingPeriod = props.expectedBookingPeriod;
    this.bookingPeriod = props.bookingPeriod;
    this.items = props.items;
    this.paymentStatus = props.paymentStatus;
    this.status = props.status;
    this.amountPaid = props.amountPaid || 0;
    this.totalBookingPrice = this.calculateTotalPrice();
  }

  static create(props: BookingCreateCommandProps): Booking {
    const newInstanceId = props.id
      ? BookingId.create(props.id)
      : BookingId.random();

    return new Booking({
      id: newInstanceId,
      customerId: props.customerId,
      eventDate: DateVo.create(props.eventDate),
      expectedBookingPeriod: new BookingPeriod({
        pickUpDate: DateVo.create(props.expectedPickUpDate),
        returnDate: DateVo.create(props.expectedReturnDate),
      }),
      bookingPeriod: props.pickUpDate
        ? new BookingPeriod({
            pickUpDate: DateVo.create(props.pickUpDate),
            returnDate: DateVo.create(props.returnDate),
          })
        : undefined,
      items: props.items,
      paymentStatus: BookingPaymentStatus.PENDING,
      status: BookingStatus.PAYMENT_PENDING,
      amountPaid: props.amountPaid,
    });
  }

  validate(fields?: string[]): void {
    const validator = BookingValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  // Behavior methods
  public calculateTotalPrice(): number {
    return this.items.reduce((acc, item) => acc + item.getRentPrice(), 0);
  }

  public updatePayment(value: number): void {
    this.amountPaid += value;
    this.validate();
  }

  public addItem(item: BookingItem): void {
    this.items.push(item);
  }

  public removeItem(itemId: string): void {
    this.items = this.items.filter(
      (item) => item.getId().getValue() !== itemId,
    );
  }

  // Getters
  public getCustomerId(): string {
    return this.customerId;
  }

  public getEventDate(): DateVo {
    return this.eventDate;
  }

  public getExpectedBookingPeriod(): BookingPeriod {
    return this.expectedBookingPeriod;
  }

  public getBookingPeriod(): BookingPeriod | undefined {
    return this.bookingPeriod;
  }

  public getItems(): BookingItem[] {
    return this.items;
  }

  public getDresses(): BookingItem[] {
    return this.items.filter((item) => item.getType() === "dress");
  }

  public getClutches(): BookingItem[] {
    return this.items.filter((item) => item.getType() === "clutch");
  }

  public getPaymentStatus(): BookingPaymentStatus {
    return this.paymentStatus;
  }

  public getStatus(): BookingStatus {
    return this.status;
  }

  public getAmountPaid(): number {
    return this.amountPaid;
  }
}
