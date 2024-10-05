import { IDomainEvent } from "../../@shared/domain/events/domain-event.interface";
import { BookingId } from "./booking.aggregate";

export class BookingAmountPaidUpdatedEvent implements IDomainEvent {
  public aggregateId: BookingId;
  public occurredOn: Date;
  public readonly amountPaid: number;

  constructor(aggregateId: BookingId, amountPaid: number) {
    this.aggregateId = aggregateId;
    this.occurredOn = new Date();
    this.amountPaid = amountPaid;
  }
}

export class BookingMarkedAsCompletedEvent implements IDomainEvent {
  public aggregateId: BookingId;
  public occurredOn: Date;

  constructor(aggregateId: BookingId) {
    this.aggregateId = aggregateId;
    this.occurredOn = new Date();
  }
}