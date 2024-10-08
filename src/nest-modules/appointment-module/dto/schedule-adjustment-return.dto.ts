import { ScheduleAdjustmentReturnInput } from "@core/appointment/application/schedule-for-adjustment/schedule-adjustment-return.use-case";
import { ApiProperty } from "@nestjs/swagger";

export class ScheduleAdjustmentReturnDto extends ScheduleAdjustmentReturnInput {
  @ApiProperty({
    name: "appointmentDate",
    description: "Data do agendamento",
    example: "2021-09-01T00:00:00.000Z",
  })
  declare appointmentDate: string;

  @ApiProperty({
    name: "bookingId",
    description: "ID do agendamento",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  declare bookingId: string;
}
