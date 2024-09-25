import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DateVo } from "@domain/@shared/vo/date.vo";
import {
  Appointment,
  AppointmentId,
  AppointmentStatus,
  AppointmentType,
} from "@domain/appointment/appointment.aggregate";

describe("Appointment Aggregate Unit Tests", function () {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-08-30"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Appointment Create Constructor", function () {
    it("should create a valid appointment with customer name and event date", () => {
      const appointmentDate = DateVo.create("2024-10-10");
      const eventDate = DateVo.create("2024-11-05");
      const customerName = "Maria Silva";

      const appointment = new Appointment({
        id: AppointmentId.create("81d4babd-9644-4b6a-afaf-930f6608f6d5"),
        appointmentDate,
        customerName,
        eventDate,
        type: AppointmentType.INITIAL_VISIT,
        status: AppointmentStatus.SCHEDULED,
      });

      expect(appointment.getId().getValue()).toBe(
        "81d4babd-9644-4b6a-afaf-930f6608f6d5",
      );
      expect(appointment.getAppointmentDate().getDateFormatted()).toBe(
        "2024-10-10",
      );
      expect(appointment.getCustomerName()).toBe("Maria Silva");
      expect(appointment.getEventDate().getDateFormatted()).toBe("2024-11-05");
      expect(appointment.getStatus()).toBe(AppointmentStatus.SCHEDULED);
      expect(appointment.getType()).toBe(AppointmentType.INITIAL_VISIT);
    });

    it("should create a valid appointment without a bookingId", () => {
      const appointmentDate = DateVo.create("2024-10-10");
      const eventDate = DateVo.create("2024-11-05");
      const customerName = "Maria Silva";

      const appointment = Appointment.create({
        appointmentDate,
        customerName,
        eventDate,
        type: AppointmentType.INITIAL_VISIT,
      });

      expect(appointment.getId().getValue()).toBeDefined();
      expect(appointment.getAppointmentDate().getDateFormatted()).toBe(
        "2024-10-10",
      );
      expect(appointment.getCustomerName()).toBe("Maria Silva");
      expect(appointment.getEventDate().getDateFormatted()).toBe("2024-11-05");
      expect(appointment.getStatus()).toBe(AppointmentStatus.SCHEDULED);
      expect(appointment.getType()).toBe(AppointmentType.INITIAL_VISIT);
    });
  });

  describe("Appointment Behavior Methods", function () {
    it("should mark an appointment as completed", () => {
      const appointment = Appointment.create({
        appointmentDate: DateVo.create("2024-10-10"),
        customerName: "Maria Silva",
        eventDate: DateVo.create("2024-11-05"),
        type: AppointmentType.PICKUP,
      });

      appointment.complete();

      expect(appointment.getStatus()).toBe(AppointmentStatus.COMPLETED);
    });

    it("should mark an appointment as canceled", () => {
      const appointment = Appointment.create({
        appointmentDate: DateVo.create("2024-10-10"),
        customerName: "Maria Silva",
        eventDate: DateVo.create("2024-11-05"),
        type: AppointmentType.RETURN_FOR_ADJUSTMENT,
      });
      appointment.cancel();
      expect(appointment.notification.hasErrors()).toBe(false);
      expect(appointment.getStatus()).toBe(AppointmentStatus.CANCELLED);
    });

    it("should have validation error if trying to cancel an already completed appointment", () => {
      const appointment = new Appointment({
        id: AppointmentId.random(),
        appointmentDate: DateVo.create("2024-10-10"),
        customerName: "Maria Silva",
        eventDate: DateVo.create("2024-11-05"),
        type: AppointmentType.RETURN_FOR_ADJUSTMENT,
        status: AppointmentStatus.COMPLETED,
      });

      appointment.cancel();

      expect(appointment.notification.hasErrors()).toBe(true);
      expect(appointment.notification).notificationContainsErrorMessages([
        "Agendamento não pode ser cancelado pois já foi concluído",
      ]);
    });

    it("should reschedule an appointment", () => {
      const appointment = Appointment.create({
        appointmentDate: DateVo.create("2024-10-10"),
        customerName: "Maria Silva",
        eventDate: DateVo.create("2024-11-05"),
        type: AppointmentType.PICKUP,
      });

      const newDate = DateVo.create("2024-10-15");

      appointment.reschedule(newDate);

      expect(appointment.getAppointmentDate().getDateFormatted()).toBe(
        "2024-10-15",
      );
    });

    it("should have validation error when trying to reschedule a completed appointment", () => {
      const appointment = new Appointment({
        id: AppointmentId.random(),
        appointmentDate: DateVo.create("2024-10-10"),
        customerName: "Maria Silva",
        eventDate: DateVo.create("2024-11-05"),
        type: AppointmentType.PICKUP,
        status: AppointmentStatus.COMPLETED,
      });
      appointment.reschedule(DateVo.create("2024-10-15"));
      expect(appointment.notification.hasErrors()).toBe(true);
      expect(appointment.notification).notificationContainsErrorMessages([
        "Agendamento não pode ser reagendado pois já foi concluído",
      ]);
    });

    it("should have history when an appointment is rescheduled", () => {
      const appointment = new Appointment({
        id: AppointmentId.random(),
        appointmentDate: DateVo.create("2024-10-10"),
        customerName: "Maria Silva",
        eventDate: DateVo.create("2024-11-05"),
        type: AppointmentType.PICKUP,
        status: AppointmentStatus.SCHEDULED,
      });

      const newDate = DateVo.create("2024-10-15");
      appointment.reschedule(newDate);
      expect(appointment.getHistory()).toHaveLength(1);
      expect(appointment.getHistory()[0].getAppointmentId()).toBe(
        appointment.getId(),
      );
      expect(appointment.getHistory()[0].getDate().getDateFormatted()).toBe(
        "2024-08-30",
      );
      expect(appointment.getHistory()[0].getStatus()).toBe(
        AppointmentStatus.SCHEDULED,
      );
    });
  });
});
