import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
} from "@core/appointment/domain/appointment.aggregate";

export class AppointmentOutput {
  id: string;
  bookingId: string | null;
  appointmentDate: string;
  customerName: string;
  eventDate: string;
  type: AppointmentType;
  history: AppointmentHistoryOutput[];
  status: AppointmentStatus;
}

export class AppointmentHistoryOutput {
  appointmentDate: string;
  date: string;
  status: AppointmentStatus;
}

export class AppointmentOutputMapper {
  public static toOutput(appointment: Appointment): AppointmentOutput {
    return {
      id: appointment.getId().toString(),
      bookingId: appointment.getBookingId()?.toString() || null,
      appointmentDate: appointment
        .getAppointmentDate()
        .getValue()
        .toISOString(),
      customerName: appointment.getCustomerName(),
      eventDate: appointment.getEventDate().getValue().toISOString(),
      type: appointment.getType(),
      history: appointment.getHistory().map((history) => ({
        status: history.getStatus(),
        date: history.getDate().getValue().toISOString(),
        appointmentDate: history.getAppointmentDate().getValue().toISOString(),
      })),
      status: appointment.getStatus(),
    };
  }

  public static toOutputMany(appointments: Appointment[]): AppointmentOutput[] {
    return appointments.map((appointment) =>
      AppointmentOutputMapper.toOutput(appointment),
    );
  }
}
