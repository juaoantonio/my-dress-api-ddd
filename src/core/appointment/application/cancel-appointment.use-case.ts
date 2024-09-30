import { IsNotEmpty, IsUUID } from "class-validator";
import { IAppointmentRepository } from "@core/appointment/domain/appointment.repository";
import { IUseCase } from "@core/@shared/application/use-case.interface";
import { AppointmentId } from "@core/appointment/domain/appointment.aggregate";
import { EntityValidationError } from "@core/@shared/domain/validators/validation.error";

export class CancelAppointmentInput {
  @IsUUID()
  @IsNotEmpty()
  appointmentId: string;
}

export class CancelAppointmentUseCase
  implements IUseCase<CancelAppointmentInput, Promise<void>>
{
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(input: CancelAppointmentInput): Promise<void> {
    const appointmentId = AppointmentId.create(input.appointmentId);
    const appointment =
      await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new Error("Agendamento não encontrado");
    }
    appointment.cancel();
    appointment.validate();
    if (appointment.notification.hasErrors())
      throw new EntityValidationError(appointment.notification.toJSON());
    await this.appointmentRepository.update(appointment);
  }
}
