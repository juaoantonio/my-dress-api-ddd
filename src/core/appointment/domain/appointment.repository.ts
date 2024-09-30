import { IRepository } from "@core/@shared/domain/repository/repository.interface";
import {
  Appointment,
  AppointmentId,
} from "@core/appointment/domain/appointment.aggregate";

export interface IAppointmentRepository
  extends IRepository<AppointmentId, Appointment> {}
