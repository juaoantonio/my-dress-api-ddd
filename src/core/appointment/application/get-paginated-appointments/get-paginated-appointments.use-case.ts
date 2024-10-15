import {
  IsDateString,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";
import { IUseCase } from "@core/@shared/application/use-case.interface";
import {
  PaginationOutput,
  PaginationOutputMapper,
} from "@core/@shared/application/pagination-output";
import {
  AppointmentOutput,
  AppointmentOutputMapper,
} from "@core/appointment/application/common/appointment.output-mapper";
import {
  AppointmentSearchParams,
  IAppointmentRepository,
} from "@core/appointment/domain/appointment.repository";

export class GetPaginatedAppointmentsUseCase
  implements
    IUseCase<
      GetPaginatedAppointmentsUseCaseInput,
      Promise<GetPaginatedAppointmentsUseCaseOutput>
    >
{
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(
    input: GetPaginatedAppointmentsUseCaseInput,
  ): Promise<GetPaginatedAppointmentsUseCaseOutput> {
    const searchParams = AppointmentSearchParams.create({
      page: input.page,
      perPage: input.limit,
      sort: input.sort,
      sortDir: input.sortDir,
      filter: {
        appointmentDate: input.appointmentDate,
        customerName: input.customerName,
      },
    });
    const result = await this.appointmentRepository.search(searchParams);
    const output = AppointmentOutputMapper.toOutputMany(result.items);
    return PaginationOutputMapper.toOutput(output, result);
  }
}

export class GetPaginatedAppointmentsUseCaseInput {
  @IsPositive()
  page: number;

  @IsPositive()
  limit: number;

  @IsString()
  @IsOptional()
  sort?: string;

  @IsString()
  @IsOptional()
  sortDir?: "desc" | "asc";

  @IsDateString()
  @IsOptional()
  appointmentDate?: string;

  @IsString()
  @IsOptional()
  customerName?: string;
}

export type GetPaginatedAppointmentsUseCaseOutput =
  PaginationOutput<AppointmentOutput>;
