import {
  GetPaginatedAppointmentsUseCaseInput,
  GetPaginatedAppointmentsUseCaseOutput,
} from "@core/appointment/application/get-paginated-appointments/get-paginated-appointments.use-case";
import { ApiProperty } from "@nestjs/swagger";
import { AppointmentOutput } from "@core/appointment/application/common/appointment.output-mapper";
import { Type } from "class-transformer";

export class GetPaginatedAppointmentsInputDto extends GetPaginatedAppointmentsUseCaseInput {
  @ApiProperty({
    name: "page",
    required: false,
    type: "number",
    description: "Número da página",
    default: 1,
  })
  @Type(() => Number)
  declare page: number;

  @ApiProperty({
    name: "limit",
    required: false,
    type: "number",
    description: "Número de itens por página",
    default: 10,
  })
  @Type(() => Number)
  declare limit: number;

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
}

export class GetPaginatedAppointmentsOutputDto
  implements GetPaginatedAppointmentsUseCaseOutput
{
  @ApiProperty({
    isArray: true,
    type: AppointmentOutput,
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
  declare items: AppointmentOutput[];

  @ApiProperty({
    type: "number",
    description: "Número total de vestidos",
    example: 1,
  })
  declare total: number;

  @ApiProperty({
    type: "number",
    description: "Número da página atual",
    example: 1,
  })
  declare currentPage: number;

  @ApiProperty({
    type: "number",
    description: "Número de itens por página",
    example: 10,
  })
  declare perPage: number;

  @ApiProperty({
    type: "number",
    description: "Número da última página",
    example: 1,
  })
  declare lastPage: number;
}
