import { BookingPeriod } from "@domain/booking/booking-period.vo";
import { AggregateRoot } from "@domain/@shared/aggregate-root";
import { Uuid } from "@domain/@shared/value-objects/uuid.vo";
import { DateVo } from "@domain/@shared/vo/date.vo";
import { BookingItem } from "@domain/booking/entities/booking-item.entity";
import { BookingValidatorFactory } from "@domain/booking/booking.validator";
import {
  BookingAmountPaidUpdatedEvent,
  BookingMarkedAsCompletedEvent,
} from "@domain/booking/booking.event";

export enum BookingStatus {
  PAYMENT_PENDING = "PAYMENT_PENDING",
  READY = "READY",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export type BookingConstructorProps = {
  id: BookingId;
  customerId: string;
  eventDate: DateVo;
  expectedBookingPeriod: BookingPeriod;
  bookingPeriod?: BookingPeriod;
  items: BookingItem[];
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
    this.status = props.status;
    this.amountPaid = props.amountPaid || 0;
    this.totalBookingPrice = this.calculateTotalPrice();
    this.registerHandler(
      BookingAmountPaidUpdatedEvent.name,
      this.onBookingAmountPaidUpdate.bind(this),
    );
    this.registerHandler(
      BookingMarkedAsCompletedEvent.name,
      this.onBookingMarkedAsCompleted.bind(this),
    );
  }

  static create(props: BookingCreateCommandProps): Booking {
    const newInstanceId = props.id
      ? BookingId.create(props.id)
      : BookingId.random();

    const newBooking = new Booking({
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
      status: BookingStatus.PAYMENT_PENDING,
      amountPaid: props.amountPaid,
    });

    newBooking.getItems().forEach((item) => {
      if (item.notification.hasErrors()) {
        newBooking.notification.addError(
          `Item de reserva (${item.getId().getValue()}) inválido`,
          "items",
        );
      }
    });

    newBooking.validate();
    return newBooking;
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
    this.validate(["amountPaid"]);
    this.applyEvent(new BookingAmountPaidUpdatedEvent(this.getId(), value));
  }

  public addItem(item: BookingItem): void {
    this.items.push(item);
    if (item.notification.hasErrors()) {
      this.notification.addError(
        `Item de reserva (${item.getId().getValue()}) inválido`,
        "items",
      );
    }
  }

  public removeItem(itemId: string): void {
    this.items = this.items.filter(
      (item) => item.getId().getValue() !== itemId,
    );
  }

  public start() {
    if (!(this.status === BookingStatus.READY)) {
      this.notification.addError("Reserva ainda não foi paga");
      return;
    }
    this.status = BookingStatus.IN_PROGRESS;
  }

  public complete() {
    if (this.status === BookingStatus.CANCELED) {
      this.notification.addError("Reserva já foi cancelada");
      return;
    }
    if (this.status === BookingStatus.PAYMENT_PENDING) {
      this.notification.addError("Reserva ainda não foi paga");
      return;
    }
    this.status = BookingStatus.COMPLETED;
    this.applyEvent(new BookingMarkedAsCompletedEvent(this.getId()));
  }

  public cancel() {
    if (this.status === BookingStatus.COMPLETED) {
      this.notification.addError("Reserva já foi finalizada");
      return;
    }
    this.status = BookingStatus.CANCELED;
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

  public getStatus(): BookingStatus {
    return this.status;
  }

  public getAmountPaid(): number {
    return this.amountPaid;
  }

  // Event handlers
  private onBookingAmountPaidUpdate(): void {
    if (this.amountPaid === this.totalBookingPrice) {
      this.status = BookingStatus.READY;
    }
  }

  private onBookingMarkedAsCompleted(): void {
    this.bookingPeriod = new BookingPeriod({
      pickUpDate: this.bookingPeriod.getPickUpDate(),
      returnDate: DateVo.create(new Date()),
    });
  }
}
