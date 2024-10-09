import { IAppointmentRepository } from "@core/appointment/domain/appointment.repository";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";
import {
  Appointment,
  AppointmentId,
} from "@core/appointment/domain/appointment.aggregate";
import { Repository } from "typeorm";
import { BaseTypeormRepository } from "@core/@shared/infra/db/typeorm/base.typeorm-repository";
import { AppointmentModelMapper } from "@core/appointment/infra/db/typeorm/appointment.model-mapper";
import { SearchParams } from "@core/@shared/domain/repository/search-params";
import { SearchResult } from "@core/@shared/domain/repository/search-result";

export class AppointmentTypeormRepository
  extends BaseTypeormRepository<AppointmentId, Appointment, AppointmentModel>
  implements IAppointmentRepository
{
  sortableFields: string[];

  constructor(
    private readonly appointmentModelRepository: Repository<AppointmentModel>,
  ) {
    super(
      appointmentModelRepository,
      new AppointmentModelMapper(),
      AppointmentId,
    );
  }

  getEntity(): { new (...args: any[]): Appointment } {
    return Appointment;
  }

  search(props: SearchParams<string>): Promise<SearchResult<Appointment>> {
    return Promise.resolve(undefined);
  }
}
