import { ScheduleInitialVisitInput } from "@core/appointment/application/schedule-initial-visit/schedule-initial-visit.use.case";
import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsString } from "class-validator";

export class ScheduleInitialVisitDto extends ScheduleInitialVisitInput {
  @ApiProperty({
    name: "appointmentDate",
    description: "Data do agendamento",
    example: "2021-09-01T00:00:00.000Z",
  })
  @IsDateString()
  declare appointmentDate: string;

  @ApiProperty({
    name: "customerName",
    description: "Nome do cliente",
    example: "Marina Silva",
  })
  @IsString()
  declare customerName: string;

  @ApiProperty({
    name: "eventDate",
    description: "Data do evento",
    example: "2021-09-01T00:00:00.000Z",
  })
  @IsDateString()
  declare eventDate: string;
}
