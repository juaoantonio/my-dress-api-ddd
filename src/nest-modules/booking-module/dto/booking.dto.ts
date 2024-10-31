import {
  BookingClutchItemOutput,
  BookingDressItemOutput,
  BookingOutput,
} from "@core/booking/application/common/booking.output-mapper";
import { BookingStatus } from "@core/booking/domain/booking.aggregate-root";
import { ApiProperty } from "@nestjs/swagger";

export class BookingOutputDto extends BookingOutput {
  @ApiProperty({
    name: "bookingId",
    description: "Identificador da reserva",
  })
  declare id: string;

  @ApiProperty({
    name: "customerName",
    description: "Nome do cliente",
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

  @ApiProperty({
    name: "pickUpDate",
    description: "Data de retirada",
  })
  declare pickUpDate: string;

  @ApiProperty({
    name: "returnDate",
    description: "Data de devolução",
  })
  declare returnDate: string;

  @ApiProperty({
    name: "status",
    description: "Status da reserva",
  })
  declare status: BookingStatus;

  @ApiProperty({
    name: "amountPaid",
    description: "Valor pago",
  })
  declare amountPaid: number;

  @ApiProperty({
    name: "totalBookingPrice",
    description: "Preço total da reserva",
  })
  declare totalBookingPrice: number;

  @ApiProperty({
    name: "dresses",
    description: "Vestidos reservados/alugados",
  })
  declare dresses: BookingDressItemOutput[];

  @ApiProperty({
    name: "clutches",
    description: "Bolsas reservadas/alugadas",
  })
  declare clutches: BookingClutchItemOutput[];
}
