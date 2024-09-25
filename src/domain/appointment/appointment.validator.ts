import { Appointment } from "@domain/appointment/appointment.aggregate";
import { ClassValidatorFields } from "@domain/validators/class-validator-fields";
import { INotification } from "@domain/validators/notification.interface";
import { IsEnum, IsOptional } from "class-validator";

class AppointmentRules {
  @IsEnum(["SCHEDULED", "COMPLETED", "CANCELED"], {
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
