import { ClassValidatorFields } from "@domain/validators/class-validator-fields";
import { IsPositive, Min } from "class-validator";
import { INotification } from "@domain/validators/notification.interface";
import { Booking } from "@domain/booking/booking.aggregate";
import { isLessThanOrEqual } from "@domain/@shared/validation/custom-class-validator-decorators";

class BookingRules {
  @isLessThanOrEqual("totalBookingPrice", {
    message: "Valor pago não pode ser maior que o valor total da reserva",
    groups: ["amountPaid"],
  })
  @Min(0, {
    message: "Valor pago deve ser positivo",
    groups: ["amountPaid"],
  })
  amountPaid: number;

  @IsPositive({
    message: "Preço total da reserva deve ser positivo",
    groups: ["totalBookingPrice"],
  })
  totalBookingPrice: number;

  constructor(aggregate: Booking) {
    Object.assign(this, aggregate);
  }
}

export class BookingValidator extends ClassValidatorFields {
  validate(
    notification: INotification,
    data: Booking,
    fields?: string[],
  ): void {
    const newFields = fields?.length ? fields : Object.keys(data);

    return super.validate(notification, new BookingRules(data), newFields);
  }
}

export class BookingValidatorFactory {
  static create() {
    return new BookingValidator();
  }
}
