import { IModelMapper } from "@core/@shared/infra/db/model.mapper.interface";
import {
  Appointment,
  AppointmentHistory,
  AppointmentId,
} from "@core/appointment/domain/appointment.aggregate";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";
import { BookingId } from "@core/booking/domain/booking.aggregate";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { AppointmentHistoryModel } from "@core/appointment/infra/db/typeorm/appointment-history.model";

export class AppointmentModelMapper
  implements IModelMapper<Appointment, AppointmentModel>
{
  toEntity(model: AppointmentModel): Appointment {
    return new Appointment({
      id: AppointmentId.create(model.id),
      bookingId: BookingId.create(model.bookingId),
      appointmentDate: DateVo.create(model.appointmentDate),
      customerName: model.customerName,
      eventDate: DateVo.create(model.eventDate),
      type: model.type,
      status: model.status,
      history: model.history.map(
        (history) =>
          new AppointmentHistory({
            appointmentId: AppointmentId.create(history.appointment.id),
            status: history.status,
            date: DateVo.create(history.date),
          }),
      ),
    });
  }

  toModel(entity: Appointment): AppointmentModel {
    const appointmentModel = new AppointmentModel({
      id: entity.getId().getValue(),
      bookingId: entity.getBookingId()?.getValue(),
      appointmentDate: entity.getAppointmentDate().getDate(),
      customerName: entity.getCustomerName(),
      eventDate: entity.getEventDate().getDate(),
      type: entity.getType(),
      status: entity.getStatus(),
    });
    appointmentModel.history = entity.getHistory().map(
      (history) =>
        new AppointmentHistoryModel({
          appointment: appointmentModel,
          status: history.getStatus(),
          date: history.getDate().getDate(),
        }),
    );
    return appointmentModel;
  }
}
