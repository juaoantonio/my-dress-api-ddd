import { IsDateString, IsNotEmpty, IsUUID } from "class-validator";
import { IAppointmentRepository } from "@core/appointment/domain/appointment.repository";
import { IUseCase } from "@core/@shared/application/use-case.interface";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import {
  Appointment,
  AppointmentId,
} from "@core/appointment/domain/appointment.aggregate";
import { EntityNotFoundError } from "@core/@shared/domain/error/entity-not-found.error";
import { EntityValidationError } from "@core/@shared/domain/validators/validation.error";

export class RescheduleAppointmentInput {
  @IsUUID()
  @IsNotEmpty()
  appointmentId: string;

  @IsDateString()
  @IsNotEmpty()
  newDate: string;
}

export class RescheduleAppointmentUseCase
  implements IUseCase<RescheduleAppointmentInput, Promise<void>>
{
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(input: RescheduleAppointmentInput): Promise<void> {
    const appointmentId = AppointmentId.create(input.appointmentId);
    const appointment =
      await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new EntityNotFoundError(appointmentId, Appointment);
    }
    const newAppointmentDate = DateVo.create(input.newDate);
    appointment.reschedule(newAppointmentDate);
    if (appointment.notification.hasErrors())
      throw new EntityValidationError(appointment.notification.toJSON());
    await this.appointmentRepository.update(appointment);
  }
}
