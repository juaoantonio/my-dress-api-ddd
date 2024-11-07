import {
  GetPaginatedAppointmentsUseCaseInput,
  GetPaginatedAppointmentsUseCaseOutput,
} from "@core/appointment/application/get-paginated-appointments/get-paginated-appointments.use-case";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { AppointmentDto } from "@nest/appointment-module/dto/appointment.dto";
import { PaginationOutputDto } from "@nest/shared-module/dtos/pagination-output.dto";

export class GetPaginatedAppointmentsInputDto extends GetPaginatedAppointmentsUseCaseInput {
  @ApiProperty({
    name: "page",
    required: false,
    type: "number",
    description: "Número da página",
    default: 1,
  })
  @Type(() => Number)
  declare page?: number;

  @ApiProperty({
    name: "limit",
    required: false,
    type: "number",
    description: "Número de itens por página",
    default: 10,
  })
  @Type(() => Number)
  declare limit?: number;

  @ApiProperty({
    name: "sort",
    required: false,
    type: "string",
    description: "Campo para ordenação",
  })
  declare sort?: string;

  @ApiProperty({
    name: "sortDir",
    required: false,
    type: "string",
    description: "Direção da ordenação",
    enum: ["desc", "asc"],
  })
  declare sortDir?: "desc" | "asc";

  @ApiProperty({
    name: "appointmentDate",
    required: false,
    type: "string",
    description: "Data do agendamento",
  })
  declare appointmentDate?: string;

  @ApiProperty({
    name: "customerName",
    required: false,
    type: "string",
    description: "Nome do cliente",
  })
  declare customerName?: string;

  @ApiProperty({
    name: "includeAll",
    required: false,
    type: "boolean",
    description: "Incluir todos os agendamentos",
    default: false,
  })
  @Transform(({ value }) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      return value.toLowerCase() === "true";
    }
    return Boolean(value);
  })
  declare includeAll?: boolean;
}

export class GetPaginatedAppointmentsOutputDto
  extends PaginationOutputDto<AppointmentDto>
  implements GetPaginatedAppointmentsUseCaseOutput
{
  @ApiProperty({
    isArray: true,
    type: AppointmentDto,
    description: "Lista de agendamentos",
    example: [
      {
        id: "667cb46b-fd52-4a5b-bdb2-1d8cc2e525ef",
        bookingId: "667cb46b-fd52-4a5b-bdb2-1d8cc2e525ed",
        appointmentDate: "2021-10-10T00:00:00.000Z",
        customerName: "Maria",
        eventDate: "2021-10-20T00:00:00.000Z",
        type: "INITIAL_VISIT",
        history: [
          {
            status: "SCHEDULED",
            date: "2021-10-08T00:00:00.000Z",
          },
        ],
        status: "SCHEDULED",
      },
    ],
  })
  declare items: AppointmentDto[];
}
