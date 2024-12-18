import { ValueObject } from "../../@shared/domain/value-object";
import { InvalidBookingPeriodError } from "./booking.errors";
import { DateVo } from "../../@shared/domain/value-objects/date.vo";
import { Period } from "@core/@shared/domain/value-objects/period.vo";

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
    returnDate?: DateVo | null;
  }): BookingPeriod {
    const bookingPeriod = new BookingPeriod(props);
    bookingPeriod.validate();
    return bookingPeriod;
  }

  public toPeriod(): Period {
    return Period.create({
      startDate: this.pickUpDate,
      endDate: this.returnDate || this.pickUpDate,
    });
  }

  validate(): void {
    if (this.pickUpDate.getValue() < new Date()) {
      throw new InvalidBookingPeriodError("Pick up date cannot be in the past");
    }

    if (this.returnDate?.getValue() < new Date()) {
      throw new InvalidBookingPeriodError("Return date cannot be in the past");
    }

    if (this.pickUpDate.getValue() > this.returnDate?.getValue()) {
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
      this.returnDate.getValue().getTime() -
        this.pickUpDate.getValue().getTime(),
    );
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
