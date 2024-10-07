import { AppointmentTypeormRepository } from "@core/appointment/infra/db/typeorm/appointment.typeorm-repository";
import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";
import { AppointmentHistoryModel } from "@core/appointment/infra/db/typeorm/appointment-history.model";
import { ScheduleAdjustmentReturnUseCase } from "@core/appointment/application/schedule-for-adjustment/schedule-adjustment-return.use-case";
import { IBookingRepository } from "@core/booking/domain/booking.repository";
import {
  Booking,
  BookingId,
} from "@core/booking/domain/booking.aggregate-root";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";

// Stub of booking repository
export const bookingRepositoryStub: IBookingRepository = {
  findById: vi.fn().mockReturnValue({
    getCustomerName: () => "John Doe",
    getEventDate: () => DateVo.create(new Date()),
  }),
  save: vi.fn(),
  update: vi.fn(),
  findMany: vi.fn(),
  delete: vi.fn(),
  deleteManyByIds: vi.fn(),
  existsById: vi.fn(),
  findManyByIds: vi.fn(),
  saveMany: vi.fn(),
  getEntity(): { new (...args: any[]): Booking } {
    return Booking;
  },
};

describe("ScheduleAdjustmentReturnUseCase Integration Test", () => {
  let useCase: ScheduleAdjustmentReturnUseCase;
  let repository: AppointmentTypeormRepository;

  const setup = setupTypeOrmForIntegrationTests({
    entities: [AppointmentModel, AppointmentHistoryModel],
  });

  beforeEach(() => {
    repository = new AppointmentTypeormRepository(
      setup.dataSource.getRepository(AppointmentModel),
    );
    useCase = new ScheduleAdjustmentReturnUseCase(
      repository,
      bookingRepositoryStub,
    );
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should schedule a adjustment return appointment", async () => {
    const input = {
      bookingId: BookingId.random().getValue(),
      appointmentDate: new Date().toISOString(),
    };
    await useCase.execute(input);
    const appointments = await repository.findMany();
    expect(appointments).toHaveLength(1);
    expect(appointments[0].getBookingId().getValue()).toBe(input.bookingId);
  });

  it("should not schedule a adjustment return appointment with invalid input", async () => {
    const input = {
      bookingId: "invalid-uuid",
      appointmentDate: "invalid-date",
    };
    await expect(useCase.execute(input)).rejects.toThrow();
    const appointments = await repository.findMany();
    expect(appointments).toHaveLength(0);
  });
});
