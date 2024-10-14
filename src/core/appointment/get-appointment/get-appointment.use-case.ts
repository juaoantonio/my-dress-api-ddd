import { IsUUID } from "class-validator";
import {
  AppointmentOutput,
  AppointmentOutputMapper,
} from "@core/appointment/application/common/appointment.output-mapper";
import { IUseCase } from "@core/@shared/application/use-case.interface";
import { IAppointmentRepository } from "@core/appointment/domain/appointment.repository";
import {
  Appointment,
  AppointmentId,
} from "@core/appointment/domain/appointment.aggregate";
import { EntityNotFoundError } from "@core/@shared/domain/error/entity-not-found.error";

export class GetAppointmentUseCase
  implements
    IUseCase<GetAppointmentUseCaseInput, Promise<GetAppointmentUseCaseOutput>>
{
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(
    input: GetAppointmentUseCaseInput,
  ): Promise<GetAppointmentUseCaseOutput> {
    const appointmentId = AppointmentId.create(input.id);
    const appointment =
      await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new EntityNotFoundError(appointmentId, Appointment);
    }
    return AppointmentOutputMapper.toOutput(appointment);
  }
}

export class GetAppointmentUseCaseInput {
  @IsUUID()
  id: string;
}

export type GetAppointmentUseCaseOutput = AppointmentOutput;
