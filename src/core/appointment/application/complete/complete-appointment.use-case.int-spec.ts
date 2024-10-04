import { AppointmentTypeormRepository } from "@core/appointment/infra/db/typeorm/appointment.typeorm-repository";
import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";
import { AppointmentHistoryModel } from "@core/appointment/infra/db/typeorm/appointment-history.model";
import { BookingId } from "@core/booking/domain/booking.aggregate";
import {
  Appointment,
  AppointmentId,
  AppointmentStatus,
  AppointmentType,
} from "@core/appointment/domain/appointment.aggregate";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { CompleteAppointmentUseCase } from "@core/appointment/application/complete/complete-appointment.use-case";

describe("CompleteAppointmentUseCase Integration Test", () => {
  let useCase: CompleteAppointmentUseCase;
  let repository: AppointmentTypeormRepository;

  const setup = setupTypeOrmForIntegrationTests({
    entities: [AppointmentModel, AppointmentHistoryModel],
  });

  beforeEach(async () => {
    repository = new AppointmentTypeormRepository(
      setup.dataSource.getRepository(AppointmentModel),
    );
    useCase = new CompleteAppointmentUseCase(repository);
    const alreadyScheduledAppointment = new Appointment({
      appointmentDate: DateVo.create(new Date()),
      bookingId: BookingId.random(),
      type: AppointmentType.RETURN_FOR_ADJUSTMENT,
      id: AppointmentId.create("9dc93e54-aceb-4072-93aa-fb28eb35723c"),
      eventDate: DateVo.create(new Date()),
      customerName: "John Doe",
      status: AppointmentStatus.SCHEDULED,
      history: [],
    });
    await repository.save(alreadyScheduledAppointment);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should complete a appointment", async () => {
    const input = {
      appointmentId: "9dc93e54-aceb-4072-93aa-fb28eb35723c",
    };
    await useCase.execute(input);
    const appointments = await repository.findMany();
    expect(appointments).toHaveLength(1);
    expect(appointments[0].getStatus()).toBe(AppointmentStatus.COMPLETED);
  });

  it("should not complete a appointment with invalid input", async () => {
    const input = {
      appointmentId: "invalid-appointment-id",
      newDate: "invalid-date",
    };
    await expect(useCase.execute(input)).rejects.toThrow();
    const appointments = await repository.findMany();
    expect(appointments[0].getStatus()).toBe(AppointmentStatus.SCHEDULED);
  });

  it("should not complete a appointment that not exists", async () => {
    const input = {
      appointmentId: "9dc93e54-aceb-4072-93aa-fb28eb35723d",
    };
    await expect(useCase.execute(input)).rejects.toThrow(
      "Appointment with id(s) 9dc93e54-aceb-4072-93aa-fb28eb35723d not found",
    );
    const appointments = await repository.findMany();
    expect(appointments[0].getStatus()).toBe(AppointmentStatus.SCHEDULED);
  });
});
