import { ClassValidatorFields } from "../../@shared/domain/validators/class-validator-fields";
import { Min } from "class-validator";
import { INotification } from "../../@shared/domain/validators/notification.interface";
import { Booking } from "./booking.aggregate-root";
import { IsLessThanOrEqual } from "@core/@shared/domain/custom-decorators/custom-class-validator-decorators";

class BookingRules {
  @IsLessThanOrEqual("totalBookingPrice", {
    message: "Valor pago não pode ser maior que o valor total da reserva",
    groups: ["amountPaid"],
  })
  @Min(0, {
    message: "Valor pago deve ser maior ou igual a 0",
    groups: ["amountPaid"],
  })
  amountPaid: number;

  @Min(0, {
    message: "Preço total da reserva deve ser maior ou igual a 0",
    groups: ["totalBookingPrice"],
  })
  totalBookingPrice: number;

  constructor(aggregate: Booking) {
    Object.assign(this, aggregate);
    this.totalBookingPrice = aggregate.calculateTotalPrice();
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
