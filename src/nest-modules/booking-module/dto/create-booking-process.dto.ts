import {
  CreateBookingProcessInput,
  CreateBookingProcessOutput,
} from "@core/booking/application/create-booking-process/create-booking-process.use-case";
import { ApiProperty } from "@nestjs/swagger";

export class CreateBookingProcessInputDto extends CreateBookingProcessInput {
  @ApiProperty({
    name: "customerName",
    description: "Data de retirada esperada",
  })
  declare customerName: string;

  @ApiProperty({
    name: "eventDate",
    description: "Data do evento",
  })
  declare eventDate: string;

  @ApiProperty({
    name: "expectedPickUpDate",
    description: "Data de retirada esperada",
  })
  declare expectedPickUpDate: string;

  @ApiProperty({
    name: "expectedReturnDate",
    description: "Data de devolução esperada",
  })
  declare expectedReturnDate: string;
}

export class CreateBookingProcessOutputDto extends CreateBookingProcessOutput {
  @ApiProperty({
    name: "bookingId",
    description: "Identificador da reserva",
  })
  declare bookingId: string;
}
