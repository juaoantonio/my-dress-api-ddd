// tests/unit/appointment/appointment.model-mapper.spec.ts

import { AppointmentModelMapper } from "@core/appointment/infra/db/typeorm/appointment.model-mapper";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";
import { AppointmentHistoryModel } from "@core/appointment/infra/db/typeorm/appointment-history.model";
import {
  Appointment,
  AppointmentHistory,
  AppointmentId,
  AppointmentStatus,
  AppointmentType,
} from "@core/appointment/domain/appointment.aggregate";
import { BookingId } from "@core/booking/domain/booking.aggregate";
import { v4 as uuidv4 } from "uuid";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";

describe("AppointmentModelMapper", () => {
  let mapper: AppointmentModelMapper;

  beforeEach(() => {
    mapper = new AppointmentModelMapper();
  });

  describe("toEntity", () => {
    it("should map AppointmentModel to Appointment entity correctly without bookingId and history", () => {
      // Arrange
      const appointmentModel = new AppointmentModel({
        id: uuidv4(),
        bookingId: null,
        appointmentDate: new Date("2024-10-03T22:51:22.124Z"),
        customerName: "John Doe",
        eventDate: new Date("2024-10-04T22:51:22.124Z"),
        type: AppointmentType.INITIAL_VISIT,
        status: AppointmentStatus.SCHEDULED,
      });

      // Act
      const appointment = mapper.toEntity(appointmentModel);

      // Assert
      expect(appointment).toBeInstanceOf(Appointment);
      expect(appointment.getId().getValue()).toBe(appointmentModel.id);
      expect(appointment.getBookingId()).toBeNull();
      expect(appointment.getAppointmentDate().getValue()).toEqual(
        new Date("2024-10-03T22:51:22.124Z"),
      );
      expect(appointment.getCustomerName()).toBe("John Doe");
      expect(appointment.getEventDate().getValue()).toEqual(
        new Date("2024-10-04T22:51:22.124Z"),
      );
      expect(appointment.getType()).toBe(AppointmentType.INITIAL_VISIT);
      expect(appointment.getStatus()).toBe(AppointmentStatus.SCHEDULED);
      expect(appointment.getHistory()).toHaveLength(0);
    });

    it("should map AppointmentModel to Appointment entity correctly with bookingId and history", () => {
      // Arrange
      const appointmentId = AppointmentId.create(uuidv4());
      const bookingId = BookingId.create(uuidv4());

      const historyModel1 = new AppointmentHistoryModel();
      historyModel1.id = uuidv4();
      historyModel1.status = AppointmentStatus.SCHEDULED;
      historyModel1.date = new Date("2024-10-05T10:00:00.000Z");
      historyModel1.appointment = null; // Assuming this is handled elsewhere

      const historyModel2 = new AppointmentHistoryModel();
      historyModel2.id = uuidv4();
      historyModel2.status = AppointmentStatus.COMPLETED;
      historyModel2.date = new Date("2024-10-06T12:00:00.000Z");
      historyModel2.appointment = null; // Assuming this is handled elsewhere

      const appointmentModel = new AppointmentModel({
        id: appointmentId.getValue(),
        bookingId: bookingId.getValue(),
        appointmentDate: new Date("2024-10-03T22:51:22.124Z"),
        customerName: "Jane Smith",
        eventDate: new Date("2024-10-04T22:51:22.124Z"),
        type: AppointmentType.RETURN,
        status: AppointmentStatus.COMPLETED,
      });

      appointmentModel.history = [historyModel1, historyModel2];

      // Act
      const appointment = mapper.toEntity(appointmentModel);

      // Assert
      expect(appointment).toBeInstanceOf(Appointment);
      expect(appointment.getId().getValue()).toBe(appointmentModel.id);
      expect(appointment.getBookingId()?.getValue()).toBe(
        appointmentModel.bookingId,
      );
      expect(appointment.getAppointmentDate().getValue()).toEqual(
        new Date("2024-10-03T22:51:22.124Z"),
      );
      expect(appointment.getCustomerName()).toBe("Jane Smith");
      expect(appointment.getEventDate().getValue()).toEqual(
        new Date("2024-10-04T22:51:22.124Z"),
      );
      expect(appointment.getType()).toBe(AppointmentType.RETURN);
      expect(appointment.getStatus()).toBe(AppointmentStatus.COMPLETED);
      expect(appointment.getHistory()).toHaveLength(2);

      const history1 = appointment.getHistory()[0];
      expect(history1).toBeInstanceOf(AppointmentHistory);
      expect(history1.getAppointmentId().getValue()).toBe(
        appointmentId.getValue(),
      );
      expect(history1.getStatus()).toBe(AppointmentStatus.SCHEDULED);
      expect(history1.getDate().getValue()).toEqual(
        new Date("2024-10-05T10:00:00.000Z"),
      );

      const history2 = appointment.getHistory()[1];
      expect(history2).toBeInstanceOf(AppointmentHistory);
      expect(history2.getAppointmentId().getValue()).toBe(
        appointmentId.getValue(),
      );
      expect(history2.getStatus()).toBe(AppointmentStatus.COMPLETED);
      expect(history2.getDate().getValue()).toEqual(
        new Date("2024-10-06T12:00:00.000Z"),
      );
    });
  });

  describe("toModel", () => {
    it("should map Appointment entity to AppointmentModel correctly without bookingId and history", () => {
      // Arrange
      const appointmentId = AppointmentId.create(uuidv4());

      const appointment = new Appointment({
        id: appointmentId,
        appointmentDate: DateVo.create(new Date("2024-10-03T22:51:22.124Z")),
        customerName: "John Doe",
        eventDate: DateVo.create(new Date("2024-10-04T22:51:22.124Z")),
        type: AppointmentType.INITIAL_VISIT,
        status: AppointmentStatus.SCHEDULED,
        // bookingId and history are optional and omitted
      });

      // Act
      const appointmentModel = mapper.toModel(appointment);

      // Assert
      expect(appointmentModel).toBeInstanceOf(AppointmentModel);
      expect(appointmentModel.id).toBe(appointment.getId().getValue());
      expect(appointmentModel.bookingId).toBeUndefined();
      expect(appointmentModel.appointmentDate).toEqual(
        new Date("2024-10-03T22:51:22.124Z"),
      );
      expect(appointmentModel.customerName).toBe("John Doe");
      expect(appointmentModel.eventDate).toEqual(
        new Date("2024-10-04T22:51:22.124Z"),
      );
      expect(appointmentModel.type).toBe(AppointmentType.INITIAL_VISIT);
      expect(appointmentModel.status).toBe(AppointmentStatus.SCHEDULED);
      expect(appointmentModel.history).toHaveLength(0);
    });

    it("should map Appointment entity to AppointmentModel correctly with bookingId and history", () => {
      // Arrange
      const appointmentId = AppointmentId.create(uuidv4());
      const bookingId = BookingId.create(uuidv4());

      const history1 = new AppointmentHistory({
        appointmentId: appointmentId,
        status: AppointmentStatus.SCHEDULED,
        date: DateVo.create(new Date("2024-10-05T10:00:00.000Z")),
      });

      const history2 = new AppointmentHistory({
        appointmentId: appointmentId,
        status: AppointmentStatus.COMPLETED,
        date: DateVo.create(new Date("2024-10-06T12:00:00.000Z")),
      });

      const appointment = new Appointment({
        id: appointmentId,
        bookingId: bookingId,
        appointmentDate: DateVo.create(new Date("2024-10-03T22:51:22.124Z")),
        customerName: "Jane Smith",
        eventDate: DateVo.create(new Date("2024-10-04T22:51:22.124Z")),
        type: AppointmentType.RETURN,
        status: AppointmentStatus.COMPLETED,
        history: [history1, history2],
      });
      // Act
      const appointmentModel = mapper.toModel(appointment);
      // Assert
      expect(appointmentModel).toBeInstanceOf(AppointmentModel);
      expect(appointmentModel.id).toBe(appointment.getId().getValue());
      expect(appointmentModel.bookingId).toBe(bookingId.getValue());
      expect(appointmentModel.appointmentDate).toEqual(
        new Date("2024-10-03T22:51:22.124Z"),
      );
      expect(appointmentModel.customerName).toBe("Jane Smith");
      expect(appointmentModel.eventDate).toEqual(
        new Date("2024-10-04T22:51:22.124Z"),
      );
      expect(appointmentModel.type).toBe(AppointmentType.RETURN);
      expect(appointmentModel.status).toBe(AppointmentStatus.COMPLETED);
      expect(appointmentModel.history).toHaveLength(2);

      const historyModel1 = appointmentModel.history[0];
      expect(historyModel1).toBeInstanceOf(AppointmentHistoryModel);
      expect(historyModel1.date).toEqual(new Date("2024-10-05T10:00:00.000Z"));
      expect(historyModel1.status).toBe(AppointmentStatus.SCHEDULED);
      expect(historyModel1.appointment).toBe(appointmentModel);

      const historyModel2 = appointmentModel.history[1];
      expect(historyModel2).toBeInstanceOf(AppointmentHistoryModel);
      expect(historyModel2.date).toEqual(new Date("2024-10-06T12:00:00.000Z"));
      expect(historyModel2.status).toBe(AppointmentStatus.COMPLETED);
      expect(historyModel2.appointment).toBe(appointmentModel);
    });
  });
});
