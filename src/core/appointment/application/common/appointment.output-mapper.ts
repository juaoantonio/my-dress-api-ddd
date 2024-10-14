import { Appointment } from "@core/appointment/domain/appointment.aggregate";

export class AppointmentOutput {
  id: string;
  bookingId: string | null;
  appointmentDate: string;
  customerName: string;
  eventDate: string;
  type: string;
  history: AppointmentHistoryOutput[];
  status: string;
}

export class AppointmentHistoryOutput {
  status: string;
  date: string;
}

export class AppointmentOutputMapper {
  public static toOutput(appointment: Appointment): AppointmentOutput {
    return {
      id: appointment.getId().toString(),
      bookingId: appointment.getBookingId()?.toString() || null,
      appointmentDate: appointment.getAppointmentDate().toString(),
      customerName: appointment.getCustomerName(),
      eventDate: appointment.getEventDate().toString(),
      type: appointment.getType().toString(),
      history: appointment.getHistory().map((history) => ({
        status: history.getStatus().toString(),
        date: history.getDate().toString(),
      })),
      status: appointment.getStatus().toString(),
    };
  }

  public static toOutputMany(appointments: Appointment[]): AppointmentOutput[] {
    return appointments.map((appointment) =>
      AppointmentOutputMapper.toOutput(appointment),
    );
  }
}
