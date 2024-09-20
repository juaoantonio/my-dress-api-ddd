import { ValueObject } from "@domain/@shared/value-object";
import { InvalidBookingPeriodError } from "@domain/booking/booking.errors";

export class BookingPeriod extends ValueObject {
  private readonly pickUpDate: Date;
  private readonly returnDate: Date;

  constructor(props: { pickUpDate: Date; returnDate: Date }) {
    super();

    if (this.pickUpDate > this.returnDate) {
      throw new InvalidBookingPeriodError(
        "Pick up date cannot be after return date",
      );
    }

    if (this.pickUpDate < new Date()) {
      throw new InvalidBookingPeriodError("Pick up date cannot be in the past");
    }

    if (this.returnDate < new Date()) {
      throw new InvalidBookingPeriodError("Return date cannot be in the past");
    }

    this.pickUpDate = props.pickUpDate;
    this.returnDate = props.returnDate;
  }
}
