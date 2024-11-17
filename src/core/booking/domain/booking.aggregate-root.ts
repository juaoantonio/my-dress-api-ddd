import { BookingPeriod } from "./booking-period.vo";
import { AggregateRoot } from "../../@shared/domain/aggregate-root";
import { Uuid } from "../../@shared/domain/value-objects/uuid.vo";
import { DateVo } from "../../@shared/domain/value-objects/date.vo";
import { BookingDressItem } from "./entities/booking-dress-item.entity";
import { BookingValidatorFactory } from "./booking.validator";
import {
  BookingAmountPaidUpdatedEvent,
  BookingMarkedAsCompletedEvent,
  BookingMarkedAsInProgressEvent,
} from "./booking.event";
import { BookingClutchItem } from "@core/booking/domain/entities/booking-clutch-item.entity";
import { BookingFakeBuilder } from "@core/booking/domain/booking-fake.builder";

export enum BookingStatus {
  NOT_INITIATED = "NOT_INITIATED",
  PAYMENT_PENDING = "PAYMENT_PENDING",
  CONFIRMED = "CONFIRMED",
  READY = "READY",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export type BookingConstructorProps = {
  id: BookingId;
  customerName: string;
  eventDate: DateVo;
  expectedBookingPeriod: BookingPeriod;
  bookingPeriod?: BookingPeriod;
  dresses?: BookingDressItem[];
  clutches?: BookingClutchItem[];
  status?: BookingStatus;
  amountPaid?: number;
};

export type BookingCreateCommandProps = {
  id?: string;
  customerName: string;
  eventDate: string;
  expectedPickUpDate: string;
  expectedReturnDate: string;
  pickUpDate?: string;
  returnDate?: string;
  dresses?: BookingDressItem[];
  clutches?: BookingClutchItem[];
  amountPaid?: number;
};

export class BookingId extends Uuid {}

export class Booking extends AggregateRoot<BookingId> {
  private customerName: string;
  private readonly eventDate: DateVo;
  private readonly expectedBookingPeriod: BookingPeriod;
  private bookingPeriod?: BookingPeriod;
  private dresses: BookingDressItem[] = [];
  private clutches: BookingClutchItem[] = [];
  private status: BookingStatus;
  private amountPaid: number = 0;

  constructor(props: BookingConstructorProps) {
    super(props.id);
    this.customerName = props.customerName;
    this.eventDate = props.eventDate;
    this.expectedBookingPeriod = props.expectedBookingPeriod;
    this.bookingPeriod = props.bookingPeriod;
    this.dresses = props.dresses ?? [];
    this.clutches = props.clutches ?? [];
    this.status = props.status;
    this.amountPaid = props.amountPaid || 0;
    this.registerHandler(
      BookingAmountPaidUpdatedEvent.name,
      this.onBookingAmountPaidUpdate.bind(this),
    );
    this.registerHandler(
      BookingMarkedAsCompletedEvent.name,
      this.onBookingMarkedAsCompleted.bind(this),
    );
    this.registerHandler(
      BookingMarkedAsInProgressEvent.name,
      this.onBookingMarkedAsInProgress.bind(this),
    );
  }

  static fake(): typeof BookingFakeBuilder {
    return BookingFakeBuilder;
  }

  static create(props: BookingCreateCommandProps): Booking {
    const newInstanceId = props.id
      ? BookingId.create(props.id)
      : BookingId.random();

    const newBooking = new Booking({
      id: newInstanceId,
      customerName: props.customerName,
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
      dresses: props.dresses,
      clutches: props.clutches,
      status: BookingStatus.NOT_INITIATED,
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
    return (
      this.dresses.reduce((acc, item) => {
        if (item.getIsCourtesy()) return acc;
        return acc + item.getRentPrice();
      }, 0) +
      this.clutches.reduce((acc, item) => {
        if (item.getIsCourtesy()) return acc;
        return acc + item.getRentPrice();
      }, 0)
    );
  }

  public addPayment(value: number): void {
    if (this.status === BookingStatus.NOT_INITIATED) {
      this.notification.addError(
        "Não é possível pagar uma reserva que ainda não foi iniciada",
      );
      return;
    }
    this.amountPaid += value;
    this.validate(["amountPaid"]);
    this.applyEvent(new BookingAmountPaidUpdatedEvent(this.getId(), value));
  }

  public addClutch(clutch: BookingClutchItem): void {
    clutch.reservationPeriods.forEach((period) => {
      if (period.overlaps(this.expectedBookingPeriod.toPeriod())) {
        this.notification.addError(
          `Clutch (${clutch.getId().getValue()}) está reservada para um período que se sobrepõe ao período esperado da reserva`,
          "clutches",
        );
      }
    });

    if (
      this.clutches.find(
        (item) => item.getProductId() === clutch.getProductId(),
      )
    )
      return;

    this.clutches.push(clutch);

    if (clutch.notification.hasErrors()) {
      this.notification.addError(
        `Item de reserva (bolsa) (${clutch.getId().getValue()}) inválido`,
        "items",
      );
    }
  }

  public addDress(dress: BookingDressItem): void {
    dress.reservationPeriods.forEach((period) => {
      if (period.overlaps(this.expectedBookingPeriod.toPeriod())) {
        this.notification.addError(
          `Dress (${dress.getId().getValue()}) está reservado para um período que se sobrepõe ao período esperado da reserva`,
          "dresses",
        );
      }
    });
    if (
      this.dresses.find((item) => item.getProductId() === dress.getProductId())
    )
      return;

    this.dresses.push(dress);

    if (dress.notification.hasErrors()) {
      this.notification.addError(
        `Item de reserva (vestido) (${dress.getId().getValue()}) inválido`,
        "items",
      );
    }
  }

  public addItem(item: BookingDressItem | BookingClutchItem): void {
    switch (item.constructor) {
      case BookingDressItem:
        this.addDress(item as BookingDressItem);
        break;
      case BookingClutchItem:
        this.addClutch(item as BookingClutchItem);
        break;
      default:
        throw new Error("Item de reserva inválido");
    }
  }

  public addManyItems(
    items: Array<BookingDressItem | BookingClutchItem>,
  ): void {
    [...this.dresses, ...this.clutches].forEach((item) => {
      if (
        items.find((newItem) => newItem.getProductId() === item.getProductId())
      )
        return;
      this.removeItem(item.getId().getValue());
    });

    items.forEach((item) => {
      this.addItem(item);
    });
  }

  public removeItem(itemId: string): void {
    this.dresses = this.dresses.filter(
      (item) => item.getId().getValue() !== itemId,
    );
    this.clutches = this.clutches.filter(
      (item) => item.getId().getValue() !== itemId,
    );
  }

  public initBookingProcess(): void {
    if (this.dresses.length === 0) {
      this.notification.addError(
        "Deve haver ao menos um vestido na reserva para poder iniciar o processo de reserva",
      );
    }
    if (this.status !== BookingStatus.NOT_INITIATED) {
      this.notification.addError("Reserva já foi iniciada");
    }
    this.status = BookingStatus.PAYMENT_PENDING;
  }

  public informItemsDelivery() {
    if (!(this.status === BookingStatus.READY)) {
      this.notification.addError("Reserva ainda não foi paga");
      return;
    }
    this.status = BookingStatus.IN_PROGRESS;
    this.applyEvent(new BookingMarkedAsInProgressEvent(this.getId()));
  }

  public complete() {
    if (this.status === BookingStatus.NOT_INITIATED) {
      this.notification.addError("Reserva ainda não foi iniciada");
      return;
    }
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

  public changeCustomerName(newName: string): void {
    this.customerName = newName;
  }

  // Getters
  public getCustomerName(): string {
    return this.customerName;
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

  public getItems(): Array<BookingDressItem | BookingClutchItem> {
    return [...this.dresses, ...this.clutches];
  }

  public getDresses(): BookingDressItem[] {
    return this.dresses;
  }

  public getClutches(): BookingClutchItem[] {
    return this.clutches;
  }

  public getStatus(): BookingStatus {
    return this.status;
  }

  public getAmountPaid(): number {
    return this.amountPaid;
  }

  // Event handlers
  private onBookingAmountPaidUpdate(): void {
    if (this.amountPaid >= this.calculateTotalPrice() / 2) {
      this.status = BookingStatus.CONFIRMED;
    }
    if (this.amountPaid >= this.calculateTotalPrice()) {
      this.status = BookingStatus.READY;
    }
  }

  private onBookingMarkedAsInProgress(): void {
    this.bookingPeriod = new BookingPeriod({
      pickUpDate: DateVo.create(new Date()),
    });
  }

  private onBookingMarkedAsCompleted(): void {
    this.bookingPeriod = new BookingPeriod({
      pickUpDate:
        this.bookingPeriod?.getPickUpDate() ?? DateVo.create(new Date()),
      returnDate: DateVo.create(new Date()),
    });
  }
}
