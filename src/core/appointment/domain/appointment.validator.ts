import { Appointment } from "./appointment.aggregate";
import { ClassValidatorFields } from "../../@shared/domain/validators/class-validator-fields";
import { INotification } from "../../@shared/domain/validators/notification.interface";
import { IsEnum, IsOptional } from "class-validator";

class AppointmentRules {
  @IsEnum(["SCHEDULED", "COMPLETED", "CANCELED", "CANCELLED"], {
    message: "Status invalido",
    groups: ["status"],
  })
  @IsOptional()
  status?: string;

  constructor(aggregate: Appointment) {
    Object.assign(this, aggregate);
  }
}

export class AppointmentValidator extends ClassValidatorFields {
  validate(
    notification: INotification,
    data: Appointment,
    fields?: string[],
  ): void {
    const newFields = fields?.length ? fields : Object.keys(data);

    return super.validate(notification, new AppointmentRules(data), newFields);
  }
}

export class AppointmentValidatorFactory {
  static create() {
    return new AppointmentValidator();
  }
}
