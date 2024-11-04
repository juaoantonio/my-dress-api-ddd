import {
  GetPaginatedBookingsInput,
  GetPaginatedBookingsOutput,
} from "@core/booking/application/get-paginated-bookings/get-paginated-bookings.use-case";
import { ApiProperty } from "@nestjs/swagger";
import { PaginationOutputDto } from "@nest/shared-module/dtos/pagination-output.dto";
import { BookingOutputDto } from "@nest/booking-module/dto/booking.dto";
import { SortDirection } from "@core/@shared/domain/repository/search-params";
import { BookingStatus } from "@core/booking/domain/booking.aggregate-root";
import { Relation } from "typeorm";
import { Type } from "class-transformer";

export class GetPaginatedBookingsInputDto extends GetPaginatedBookingsInput {
  @ApiProperty({
    name: "page",
    description: "Página",
    example: 1,
    required: false,
    default: 1,
  })
  @Type(() => Number)
  declare page?: number;

  @ApiProperty({
    name: "limit",
    description: "Limite",
    example: 10,
    required: false,
    default: 10,
  })
  @Type(() => Number)
  declare limit?: number;

  @ApiProperty({
    name: "sortDir",
    description: "Direção da ordenação",
    enum: ["asc", "desc"],
    required: false,
  })
  declare sortDir?: SortDirection;

  @ApiProperty({
    name: "customerName",
    description: "Nome do cliente",
    example: "Maria Silva",
    required: false,
  })
  declare customerName?: string;

  @ApiProperty({
    name: "eventDate",
    description: "Data do evento",
    example: "2021-10-10T10:00:00Z",
    required: false,
  })
  declare eventDate?: string;

  @ApiProperty({
    name: "expectedPickUpDate",
    description: "Data de retirada esperada",
    example: "2021-10-10T10:00:00Z",
    required: false,
  })
  declare expectedPickUpDate?: string;

  @ApiProperty({
    name: "expectedReturnDate",
    description: "Data de devolução esperada",
    example: "2021-10-10T10:00:00Z",
    required: false,
  })
  declare expectedReturnDate?: string;

  @ApiProperty({
    name: "status",
    description: "Status da reserva",
    enum: [
      "NOT_INITIATED",
      "PAYMENT_PENDING",
      "READY",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELED",
    ],
    required: false,
  })
  declare status?: Relation<BookingStatus>;
}

export class GetPaginatedBookingsOutputDto
  extends PaginationOutputDto<BookingOutputDto>
  implements GetPaginatedBookingsOutput
{
  @ApiProperty({
    isArray: true,
    type: () => BookingOutputDto,
    description: "Listagem de reservas",
  })
  declare items: BookingOutputDto[];
}
