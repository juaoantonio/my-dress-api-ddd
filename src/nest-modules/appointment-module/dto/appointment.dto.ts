import {
  AppointmentHistoryOutput,
  AppointmentOutput,
} from "@core/appointment/application/common/appointment.output-mapper";
import {
  AppointmentStatus,
  AppointmentType,
} from "@core/appointment/domain/appointment.aggregate";
import { ApiProperty } from "@nestjs/swagger";

export class AppointmentHistoryDto extends AppointmentHistoryOutput {
  @ApiProperty({
    name: "status",
    required: true,
    type: "string",
    description: "Status do agendamento",
    enum: ["SCHEDULED", "CANCELLED", "COMPLETED"],
  })
  declare status: AppointmentStatus;

  @ApiProperty({
    name: "date",
    required: true,
    type: "string",
    description: "Data da alteração",
  })
  declare date: string;

  @ApiProperty({
    name: "appointmentDate",
    required: true,
    type: "string",
    description: "Data anterior do agendamento",
  })
  declare appointmentDate: string;
}

export class AppointmentDto extends AppointmentOutput {
  @ApiProperty({
    name: "id",
    required: true,
    type: "string",
    description: "Identificador do agendamento",
  })
  declare id: string;

  @ApiProperty({
    name: "bookingId",
    required: false,
    type: "string",
    description: "Identificador da reserva relacionada ao agendamento",
  })
  declare bookingId: string | null;

  @ApiProperty({
    name: "appointmentDate",
    required: true,
    type: "string",
    description: "Data do agendamento",
  })
  declare appointmentDate: string;

  @ApiProperty({
    name: "customerName",
    required: true,
    type: "string",
    description: "Nome do cliente",
  })
  declare customerName: string;

  @ApiProperty({
    name: "eventDate",
    required: true,
    type: "string",
    description: "Data do evento",
  })
  declare eventDate: string;

  @ApiProperty({
    name: "type",
    required: true,
    type: "string",
    description: "Tipo do agendamento",
    enum: ["INITIAL_VISIT", "RETURN_FOR_ADJUSTMENT", "PICKUP", "RETURN"],
  })
  declare type: AppointmentType;

  @ApiProperty({
    name: "history",
    required: true,
    type: [AppointmentHistoryDto],
    description: "Histórico do agendamento",
  })
  declare history: AppointmentHistoryDto[];

  @ApiProperty({
    name: "status",
    required: true,
    type: "string",
    description: "Status do agendamento",
    enum: ["SCHEDULED", "CANCELLED", "COMPLETED"],
  })
  declare status: AppointmentStatus;
}
