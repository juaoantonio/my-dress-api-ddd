import { DressId } from "@domain/dress/dress-id.vo";
import { ClutchId } from "@domain/clutch/clutch-id.vo";
import { BookingPeriod } from "@domain/booking/booking-period.vo";
import { AggregateRoot } from "@domain/@shared/aggregate-root";
import { Uuid } from "@domain/@shared/value-objects/uuid.vo";

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
  eventDate: Date;
  expectedBookingPeriod: BookingPeriod;
  bookingPeriod: BookingPeriod;
  dresses: DressId[];
  clutches: ClutchId[];
  paymentStatus?: BookingPaymentStatus;
  status?: BookingStatus;
};

export type BookingCreateCommandProps = {
  id?: string;
  customerId: string;
  eventDate: Date;
  expectedBookingPeriod: BookingPeriod;
  dresses: DressId[];
  clutches: ClutchId[];
};

export class BookingId extends Uuid {}

export class Booking extends AggregateRoot<BookingId> {
  private customerId: string;
  private eventDate: Date;
  private expectedBookingPeriod: BookingPeriod;
  private bookingPeriod: BookingPeriod;
  private dresses: DressId[] = [];
  private clutches: ClutchId[] = [];
  private paymentStatus: BookingPaymentStatus;
  private status: BookingStatus;

  constructor({
    bookingPeriod,
    expectedBookingPeriod,
    clutches,
    paymentStatus,
    status,
    dresses,
    customerId,
    eventDate,
    id,
  }: BookingConstructorProps) {
    super(id);
    this.customerId = customerId;
    this.eventDate = eventDate;
    this.expectedBookingPeriod = expectedBookingPeriod;
    this.bookingPeriod = bookingPeriod;
    this.dresses = dresses;
    this.clutches = clutches;
    this.paymentStatus = paymentStatus;
    this.status = status;
  }

  // Getters
  public getCustomerId(): string {
    return this.customerId;
  }

  public getEventDate(): Date {
    return this.eventDate;
  }

  public getExpectedBookingPeriod(): BookingPeriod {
    return this.expectedBookingPeriod;
  }

  public getBookingPeriod(): BookingPeriod {
    return this.bookingPeriod;
  }
}
