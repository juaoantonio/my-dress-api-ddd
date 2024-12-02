import {
  BookingClutchItemOutput,
  BookingDressItemOutput,
  BookingOutput,
} from "@core/booking/application/common/booking.output-mapper";
import { BookingStatus } from "@core/booking/domain/booking.aggregate-root";
import { ApiProperty } from "@nestjs/swagger";
import { Relation } from "typeorm";
import { AdjustmentOutputDto } from "@nest/booking-module/dto/add-adjustment.dto";

export class BookingOutputDto extends BookingOutput {
  @ApiProperty({
    name: "id",
    description: "Identificador da reserva",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  declare id: string;

  @ApiProperty({
    name: "customerName",
    description: "Nome do cliente",
    example: "Maria Silva",
  })
  declare customerName: string;

  @ApiProperty({
    name: "eventDate",
    description: "Data do evento",
    example: "2021-10-10T10:00:00Z",
  })
  declare eventDate: string;

  @ApiProperty({
    name: "expectedPickUpDate",
    description: "Data de retirada esperada",
    example: "2021-10-09T10:00:00Z",
  })
  declare expectedPickUpDate: string;

  @ApiProperty({
    name: "expectedReturnDate",
    description: "Data de devolução esperada",
    example: "2021-10-12T10:00:00Z",
  })
  declare expectedReturnDate: string;

  @ApiProperty({
    name: "pickUpDate",
    description: "Data de retirada",
    example: null,
  })
  declare pickUpDate: string | null;

  @ApiProperty({
    name: "returnDate",
    description: "Data de devolução",
    example: null,
  })
  declare returnDate: string | null;

  @ApiProperty({
    name: "status",
    description: "Status da reserva",
    enum: BookingStatus,
  })
  declare status: Relation<BookingStatus>;

  @ApiProperty({
    name: "amountPaid",
    description: "Valor pago",
  })
  declare amountPaid: number;

  @ApiProperty({
    name: "totalBookingPrice",
    description: "Preço total da reserva",
    example: 200,
  })
  declare totalBookingPrice: number;

  @ApiProperty({
    name: "dresses",
    description: "Vestidos reservados/alugados",
    isArray: true,
    type: () => BookingDressItemOutputDto,
  })
  declare dresses: BookingDressItemOutputDto[];

  @ApiProperty({
    name: "clutches",
    description: "Bolsas reservadas/alugadas",
    isArray: true,
    type: () => BookingClutchItemOutputDto,
  })
  declare clutches: BookingClutchItemOutputDto[];
}

export class BookingDressItemOutputDto extends BookingDressItemOutput {
  @ApiProperty({
    name: "id",
    description: "Identificador do item",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  declare id: string;

  @ApiProperty({
    name: "productId",
    description: "Identificador do produto",
    example: "123e4567-e89b-12d3-a456-426614174001",
  })
  declare productId: string;

  @ApiProperty({
    name: "rentPrice",
    description: "Preço do aluguel",
    example: 100,
  })
  declare rentPrice: number;

  @ApiProperty({
    name: "color",
    description: "Cor do vestido",
    example: "Vermelho",
  })
  declare color: string;

  @ApiProperty({
    name: "model",
    description: "Modelo do vestido",
    example: "Sereia",
  })
  declare model: string;

  @ApiProperty({
    name: "fabric",
    description: "Tecido do vestido",
    example: "Seda",
  })
  declare fabric: string;

  @ApiProperty({
    name: "imagePath",
    description: "Caminho da imagem do vestido",
    example: "http://image.com",
  })
  declare imagePath: string;

  @ApiProperty({
    name: "isCourtesy",
    description: "Cortesia",
    example: false,
  })
  declare isCourtesy: boolean;

  @ApiProperty({
    name: "adjustments",
    description: "Ajustes",
    isArray: true,
    type: () => AdjustmentOutputDto,
  })
  declare adjustments: AdjustmentOutputDto[];
}

export class BookingClutchItemOutputDto extends BookingClutchItemOutput {
  @ApiProperty({
    name: "id",
    description: "Identificador do item",
    example: "123e4567-e89b-12d3-a456-426614174003",
  })
  declare id: string;

  @ApiProperty({
    name: "productId",
    description: "Identificador do produto",
    example: "123e4567-e89b-12d3-a456-426614174004",
  })
  declare productId: string;

  @ApiProperty({
    name: "rentPrice",
    description: "Preço do aluguel",
    example: 100,
  })
  declare rentPrice: number;

  @ApiProperty({
    name: "color",
    description: "Cor da bolsa",
    example: "Azul",
  })
  declare color: string;

  @ApiProperty({
    name: "model",
    description: "Modelo da bolsa",
    example: "Strass",
  })
  declare model: string;

  @ApiProperty({
    name: "imagePath",
    description: "Caminho da imagem da bolsa",
    example: "http://image.com",
  })
  declare imagePath: string;

  @ApiProperty({
    name: "isCourtesy",
    description: "Cortesia",
    example: false,
  })
  declare isCourtesy: boolean;
}
