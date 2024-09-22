import { ValueObject } from "@domain/@shared/value-object";
import { InvalidBookingPeriodError } from "@domain/booking/booking.errors";
import { DateVo } from "@domain/@shared/vo/date.vo";

export class BookingPeriod extends ValueObject {
  private readonly pickUpDate: DateVo;
  private readonly returnDate?: DateVo;

  constructor(props: { pickUpDate: DateVo; returnDate?: DateVo }) {
    super();

    this.pickUpDate = props.pickUpDate;
    this.returnDate = props.returnDate;
  }

  static create(props: {
    pickUpDate: DateVo;
    returnDate?: DateVo;
  }): BookingPeriod {
    const bookingPeriod = new BookingPeriod(props);
    bookingPeriod.validate();
    return bookingPeriod;
  }

  validate(): void {
    if (this.pickUpDate.getDate() < new Date()) {
      throw new InvalidBookingPeriodError("Pick up date cannot be in the past");
    }

    if (this.returnDate?.getDate() < new Date()) {
      throw new InvalidBookingPeriodError("Return date cannot be in the past");
    }

    if (this.pickUpDate.getDate() > this.returnDate.getDate()) {
      throw new InvalidBookingPeriodError(
        "Pick up date cannot be after return date",
      );
    }
  }

  public getPickUpDate(): DateVo {
    return this.pickUpDate;
  }

  public getReturnDate(): DateVo {
    return this.returnDate;
  }

  public getTotalDays(): number {
    const diffTime = Math.abs(
      this.returnDate.getDate().getTime() - this.pickUpDate.getDate().getTime(),
    );
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
