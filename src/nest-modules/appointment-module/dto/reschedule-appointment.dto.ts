import { IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RescheduleAppointmentDto {
  @ApiProperty({
    name: "newDate",
    description: "The new date for the appointment",
    example: "2021-09-01T00:00:00.000Z",
  })
  @IsDateString()
  newDate: string;
}
