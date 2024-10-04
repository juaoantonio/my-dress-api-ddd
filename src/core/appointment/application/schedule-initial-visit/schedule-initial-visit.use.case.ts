import { IsDateString, IsNotEmpty, IsString } from "class-validator";
import {
  Appointment,
  AppointmentType,
} from "@core/appointment/domain/appointment.aggregate";
import { IUseCase } from "@core/@shared/application/use-case.interface";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { IAppointmentRepository } from "@core/appointment/domain/appointment.repository";
import { EntityValidationError } from "@core/@shared/domain/validators/validation.error";

export class ScheduleInitialVisitInput {
  @IsDateString()
  @IsNotEmpty()
  appointmentDate: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsDateString()
  @IsNotEmpty()
  eventDate: string;
}

export class ScheduleInitialVisitUseCase
  implements IUseCase<ScheduleInitialVisitInput, Promise<void>>
{
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(input: ScheduleInitialVisitInput): Promise<void> {
    const appointment = Appointment.create({
      appointmentDate: DateVo.create(input.appointmentDate),
      customerName: input.customerName,
      eventDate: DateVo.create(input.eventDate),
      type: AppointmentType.INITIAL_VISIT,
    });
    if (appointment.notification.hasErrors())
      throw new EntityValidationError(appointment.notification.toJSON());
    await this.appointmentRepository.save(appointment);
  }
}
