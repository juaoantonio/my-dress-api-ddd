import { AppointmentTypeormRepository } from "@core/appointment/infra/db/typeorm/appointment.typeorm-repository";
import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";

describe("AppointmentTypeormRepository Integration Test", () => {
  let repository: AppointmentTypeormRepository;
  const setup = setupTypeOrmForIntegrationTests({
    entities: [AppointmentModel],
  });

  beforeEach(() => {
    const modelRepository = setup.dataSource.getRepository(AppointmentModel);
    repository = new AppointmentTypeormRepository(modelRepository);
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });
});
