import { ScheduleInitialVisitUseCase } from "@core/appointment/application/schedule-initial-visit/schedule-initial-visit.use.case";
import { AppointmentTypeormRepository } from "@core/appointment/infra/db/typeorm/appointment.typeorm-repository";
import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";
import { AppointmentHistoryModel } from "@core/appointment/infra/db/typeorm/appointment-history.model";

describe("ScheduleInitialVisitUseCase Integration Test", () => {
  let useCase: ScheduleInitialVisitUseCase;
  let repository: AppointmentTypeormRepository;

  const setup = setupTypeOrmForIntegrationTests({
    entities: [AppointmentModel, AppointmentHistoryModel],
  });

  beforeEach(() => {
    repository = new AppointmentTypeormRepository(
      setup.dataSource.getRepository(AppointmentModel),
    );
    useCase = new ScheduleInitialVisitUseCase(repository);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should schedule a initial visit appointment", async () => {
    const input = {
      appointmentDate: new Date().toISOString(),
      customerName: "John Doe",
      eventDate: new Date().toISOString(),
    };
    await useCase.execute(input);
    const appointments = await repository.findMany();
    expect(appointments).toHaveLength(1);
    const savedAppointment = appointments[0];
    expect(savedAppointment.getCustomerName()).toBe(input.customerName);
    expect(savedAppointment.getAppointmentDate().getValue().toISOString()).toBe(
      new Date(input.appointmentDate).toISOString(),
    );
    expect(savedAppointment.getEventDate().getValue().toISOString()).toBe(
      new Date(input.eventDate).toISOString(),
    );
  });

  it("should not schedule a initial visit appointment with invalid input", async () => {
    const input = {
      appointmentDate: "invalid-date",
      customerName: "John Doe",
      eventDate: new Date().toISOString(),
    };
    await expect(useCase.execute(input)).rejects.toThrow();
    const appointments = await repository.findMany();
    expect(appointments).toHaveLength(0);
  });
});
