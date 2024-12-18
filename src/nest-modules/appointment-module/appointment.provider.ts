// https://docs.nestjs.com/fundamentals/custom-providers
import { AppointmentTypeormRepository } from "@core/appointment/infra/db/typeorm/appointment.typeorm-repository";
import { Repository } from "typeorm";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CancelAppointmentUseCase } from "@core/appointment/application/cancel/cancel-appointment.use-case";
import { IAppointmentRepository } from "@core/appointment/domain/appointment.repository";
import { CompleteAppointmentUseCase } from "@core/appointment/application/complete/complete-appointment.use-case";
import { RescheduleAppointmentUseCase } from "@core/appointment/application/reschedule/reschedule-appointment.use-case";
import { ScheduleInitialVisitUseCase } from "@core/appointment/application/schedule-initial-visit/schedule-initial-visit.use.case";
import { ScheduleAdjustmentReturnUseCase } from "@core/appointment/application/schedule-for-adjustment/schedule-adjustment-return.use-case";
import { IBookingRepository } from "@core/booking/domain/booking.repository";
import { ProviderType } from "@nest/shared-module/types/provider.type";
import { GetPaginatedAppointmentsUseCase } from "@core/appointment/application/get-paginated-appointments/get-paginated-appointments.use-case";
import { GetAppointmentUseCase } from "@core/appointment/application/get-appointment/get-appointment.use-case";
import { BOOKING_PROVIDERS } from "@nest/booking-module/booking.providers";

export const REPOSITORIES: ProviderType = {
  DEFAULT_APPOINTMENT_REPOSITORY: {
    provide: "IAppointmentRepository",
    useExisting: AppointmentTypeormRepository,
  },
  TYPEORM_APPOINTMENT_REPOSITORY: {
    provide: AppointmentTypeormRepository,
    useFactory: (exampleRepository: Repository<AppointmentModel>) => {
      return new AppointmentTypeormRepository(exampleRepository);
    },
    inject: [getRepositoryToken(AppointmentModel)],
  },
};

export const USE_CASES: ProviderType = {
  CANCEL_APPOINTMENT_USE_CASE: {
    provide: CancelAppointmentUseCase,
    useFactory: (appointmentRepository: IAppointmentRepository) => {
      return new CancelAppointmentUseCase(appointmentRepository);
    },
    inject: [REPOSITORIES.DEFAULT_APPOINTMENT_REPOSITORY.provide],
  },

  COMPLETE_APPOINTMENT_USE_CASE: {
    provide: CompleteAppointmentUseCase,
    useFactory: (appointmentRepository: IAppointmentRepository) => {
      return new CompleteAppointmentUseCase(appointmentRepository);
    },
    inject: [REPOSITORIES.DEFAULT_APPOINTMENT_REPOSITORY.provide],
  },

  RESCHEDULE_APPOINTMENT_USE_CASE: {
    provide: RescheduleAppointmentUseCase,
    useFactory: (appointmentRepository: IAppointmentRepository) => {
      return new RescheduleAppointmentUseCase(appointmentRepository);
    },
    inject: [REPOSITORIES.DEFAULT_APPOINTMENT_REPOSITORY.provide],
  },

  SCHEDULE_INITIAL_VISIT_APPOINTMENT_USE_CASE: {
    provide: ScheduleInitialVisitUseCase,
    useFactory: (appointmentRepository: IAppointmentRepository) => {
      return new ScheduleInitialVisitUseCase(appointmentRepository);
    },
    inject: [REPOSITORIES.DEFAULT_APPOINTMENT_REPOSITORY.provide],
  },

  SCHEDULE_FOR_ADJUSTMENT_APPOINTMENT_USE_CASE: {
    provide: ScheduleAdjustmentReturnUseCase,
    useFactory: (
      appointmentRepository: IAppointmentRepository,
      bookingRepository: IBookingRepository,
    ) => {
      return new ScheduleAdjustmentReturnUseCase(
        appointmentRepository,
        bookingRepository,
      );
    },
    inject: [
      REPOSITORIES.DEFAULT_APPOINTMENT_REPOSITORY.provide,
      BOOKING_PROVIDERS.REPOSITORIES.DEFAULT_BOOKING_REPOSITORY.provide,
    ],
  },

  GET_APPOINTMENT_USE_CASE: {
    provide: GetAppointmentUseCase,
    useFactory: (appointmentRepository: IAppointmentRepository) => {
      return new GetAppointmentUseCase(appointmentRepository);
    },
    inject: [REPOSITORIES.DEFAULT_APPOINTMENT_REPOSITORY.provide],
  },

  GET_PAGINATED_APPOINTMENTS_USE_CASE: {
    provide: GetPaginatedAppointmentsUseCase,
    useFactory: (appointmentRepository: IAppointmentRepository) => {
      return new GetPaginatedAppointmentsUseCase(appointmentRepository);
    },
    inject: [REPOSITORIES.DEFAULT_APPOINTMENT_REPOSITORY.provide],
  },
};

export const APPOINTMENT_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};
