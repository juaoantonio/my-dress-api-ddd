import {
  AppointmentFilter,
  AppointmentSearchParams,
  AppointmentSearchResult,
  IAppointmentRepository,
} from "@core/appointment/domain/appointment.repository";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";
import {
  Appointment,
  AppointmentId,
  AppointmentStatus,
} from "@core/appointment/domain/appointment.aggregate";
import { FindOptionsOrder, FindOptionsWhere, ILike, Repository } from "typeorm";
import { BaseTypeormRepository } from "@core/@shared/infra/db/typeorm/base.typeorm-repository";
import { AppointmentModelMapper } from "@core/appointment/infra/db/typeorm/appointment.model-mapper";
import { SearchResult } from "@core/@shared/domain/repository/search-result";

export class AppointmentTypeormRepository
  extends BaseTypeormRepository<
    AppointmentId,
    Appointment,
    AppointmentModel,
    AppointmentFilter,
    AppointmentSearchParams,
    AppointmentSearchResult
  >
  implements IAppointmentRepository
{
  sortableFields: string[] = ["appointmentDate", "customerName", "status"];

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

  async search(
    props: AppointmentSearchParams,
  ): Promise<SearchResult<Appointment>> {
    const { page, perPage, sort, sortDir, filter } = props;
    const offset = (page - 1) * perPage;
    const limit = perPage;
    const whereClause: FindOptionsWhere<AppointmentModel> = {};
    if (filter?.appointmentDate) {
      whereClause.appointmentDate = filter.appointmentDate.getValue();
    }
    if (filter?.customerName) {
      whereClause.customerName = ILike(`%${filter.customerName}%`);
    }
    if (filter?.includeAll === false) {
      whereClause.status = AppointmentStatus.SCHEDULED;
    }
    const order: FindOptionsOrder<AppointmentModel> = {};
    if (sort && this.sortableFields.includes(sort)) {
      order[sort] = sortDir;
    } else {
      order.appointmentDate = "desc";
    }
    const [models, count] = await this.modelRepository.findAndCount({
      where: whereClause,
      order,
      skip: offset,
      take: limit,
    });
    const items = models.map((model) => this.modelMapper.toEntity(model));
    return new SearchResult({
      items,
      total: count,
      currentPage: page,
      perPage,
    });
  }
}
