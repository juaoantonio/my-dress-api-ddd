import { IsNotEmpty, IsUUID } from "class-validator";
import { IAppointmentRepository } from "@core/appointment/domain/appointment.repository";
import { IUseCase } from "@core/@shared/application/use-case.interface";
import {
  Appointment,
  AppointmentId,
} from "@core/appointment/domain/appointment.aggregate";
import { EntityNotFoundError } from "@core/@shared/domain/error/entity-not-found.error";
import { EntityValidationError } from "@core/@shared/domain/validators/validation.error";

export class CompleteAppointmentInput {
  @IsUUID()
  @IsNotEmpty()
  appointmentId: string;
}

export class CompleteAppointmentUseCase
  implements IUseCase<CompleteAppointmentInput, Promise<void>>
{
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(input: CompleteAppointmentInput): Promise<void> {
    const appointmentId = AppointmentId.create(input.appointmentId);
    const appointment =
      await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new EntityNotFoundError(appointmentId, Appointment);
    }
    appointment.complete();
    appointment.validate();
    if (appointment.notification.hasErrors())
      throw new EntityValidationError(appointment.notification.toJSON());
    await this.appointmentRepository.update(appointment);
  }
}
