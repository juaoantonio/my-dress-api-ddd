// https://docs.nestjs.com/fundamentals/custom-providers
import { AppointmentTypeormRepository } from "@core/appointment/infra/db/typeorm/appointment.typeorm-repository";
import { Repository } from "typeorm";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ExistingProvider, FactoryProvider } from "@nestjs/common";
import { CancelAppointmentUseCase } from "@core/appointment/application/cancel/cancel-appointment.use-case";
import { IAppointmentRepository } from "@core/appointment/domain/appointment.repository";
import { CompleteAppointmentUseCase } from "@core/appointment/application/complete/complete-appointment.use-case";
import { RescheduleAppointmentUseCase } from "@core/appointment/application/reschedule/reschedule-appointment.use-case";
import { ScheduleInitialVisitUseCase } from "@core/appointment/application/schedule-initial-visit/schedule-initial-visit.use.case";

export const REPOSITORIES: Record<string, ExistingProvider | FactoryProvider> =
  {
    DEFAULT_EXAMPLE_REPOSITORY: {
      provide: "IAppointmentRepository",
      useExisting: AppointmentTypeormRepository,
    },
    TYPEORM_EXAMPLE_REPOSITORY: {
      provide: AppointmentTypeormRepository,
      useFactory: (exampleRepository: Repository<AppointmentModel>) => {
        return new AppointmentTypeormRepository(exampleRepository);
      },
      inject: [getRepositoryToken(AppointmentModel)],
    },
  };

export const USE_CASES: Record<string, ExistingProvider | FactoryProvider> = {
  CANCEL_APPOINTMENT_USE_CASE: {
    provide: CancelAppointmentUseCase,
    useFactory: (appointmentRepository: IAppointmentRepository) => {
      return new CancelAppointmentUseCase(appointmentRepository);
    },
    inject: [REPOSITORIES.DEFAULT_EXAMPLE_REPOSITORY.provide],
  },
  COMPLETE_APPOINTMENT_USE_CASE: {
    provide: CompleteAppointmentUseCase,
    useFactory: (appointmentRepository: IAppointmentRepository) => {
      return new CompleteAppointmentUseCase(appointmentRepository);
    },
    inject: [REPOSITORIES.DEFAULT_EXAMPLE_REPOSITORY.provide],
  },
  RESCHEDULE_APPOINTMENT_USE_CASE: {
    provide: RescheduleAppointmentUseCase,
    useFactory: (appointmentRepository: IAppointmentRepository) => {
      return new RescheduleAppointmentUseCase(appointmentRepository);
    },
    inject: [REPOSITORIES.DEFAULT_EXAMPLE_REPOSITORY.provide],
  },
  SCHEDULE_INITIAL_VISIT_APPOINTMENT_USE_CASE: {
    provide: ScheduleInitialVisitUseCase,
    useFactory: (appointmentRepository: IAppointmentRepository) => {
      return new ScheduleInitialVisitUseCase(appointmentRepository);
    },
    inject: [REPOSITORIES.DEFAULT_EXAMPLE_REPOSITORY.provide],
  },
  // TODO: Uncomment when the booking repository is implemented
  // SCHEDULE_FOR_ADJUSTMENT_APPOINTMENT_USE_CASE: {},
};

export const APPOINTMENT_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};
