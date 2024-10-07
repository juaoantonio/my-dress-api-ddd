import { AppointmentTypeormRepository } from "@core/appointment/infra/db/typeorm/appointment.typeorm-repository";
import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";
import { AppointmentHistoryModel } from "@core/appointment/infra/db/typeorm/appointment-history.model";
import { BookingId } from "@core/booking/domain/booking.aggregate-root";
import { RescheduleAppointmentUseCase } from "@core/appointment/application/reschedule/reschedule-appointment.use-case";
import {
  Appointment,
  AppointmentId,
  AppointmentStatus,
  AppointmentType,
} from "@core/appointment/domain/appointment.aggregate";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";

describe("ScheduleAdjustmentReturnUseCase Integration Test", () => {
  let useCase: RescheduleAppointmentUseCase;
  let repository: AppointmentTypeormRepository;

  const setup = setupTypeOrmForIntegrationTests({
    entities: [AppointmentModel, AppointmentHistoryModel],
  });

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01"));
  });

  beforeEach(async () => {
    repository = new AppointmentTypeormRepository(
      setup.dataSource.getRepository(AppointmentModel),
    );
    useCase = new RescheduleAppointmentUseCase(repository);
    const alreadyScheduledAppointment = new Appointment({
      appointmentDate: DateVo.create(new Date("2024-01-01")),
      bookingId: BookingId.random(),
      type: AppointmentType.RETURN_FOR_ADJUSTMENT,
      id: AppointmentId.create("9dc93e54-aceb-4072-93aa-fb28eb35723c"),
      eventDate: DateVo.create(new Date("2024-01-05")),
      customerName: "John Doe",
      status: AppointmentStatus.SCHEDULED,
      history: [],
    });
    await repository.save(alreadyScheduledAppointment);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should reeschedule a appointment", async () => {
    const newDate = new Date(
      new Date().getTime() + 24 * 60 * 60 * 1000,
    ).toISOString();
    const input = {
      appointmentId: "9dc93e54-aceb-4072-93aa-fb28eb35723c",
      // one day after
      newDate,
    };
    await useCase.execute(input);
    const appointments = await repository.findMany();
    expect(appointments).toHaveLength(1);
    expect(appointments[0].getAppointmentDate().getValue().toISOString()).toBe(
      input.newDate,
    );
    expect(appointments[0].getHistory()).toHaveLength(1);
    expect(appointments[0].getHistory()[0].getAppointmentId().getValue()).toBe(
      "9dc93e54-aceb-4072-93aa-fb28eb35723c",
    );
    expect(appointments[0].getHistory()[0].getStatus()).toBe(
      AppointmentStatus.SCHEDULED,
    );
    expect(
      appointments[0].getHistory()[0].getDate().getValue().toISOString(),
    ).toBe(new Date("2024-01-01").toISOString());
  });

  it("should not reschedule a appointment with invalid input", async () => {
    const input = {
      appointmentId: "invalid-appointment-id",
      newDate: "invalid-date",
    };
    await expect(useCase.execute(input)).rejects.toThrow();
    const appointments = await repository.findMany();
    expect(appointments).toHaveLength(1);
  });

  it("should not reeschedule a appointment that not exists", async () => {
    const input = {
      appointmentId: "9dc93e54-aceb-4072-93aa-fb28eb35723d",
      newDate: new Date().toISOString(),
    };
    await expect(useCase.execute(input)).rejects.toThrow(
      "Appointment with id(s) 9dc93e54-aceb-4072-93aa-fb28eb35723d not found",
    );
    const appointments = await repository.findMany();
    expect(appointments).toHaveLength(1);
  });
});
