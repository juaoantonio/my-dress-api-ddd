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

export class GetPaginatedBookingsInputDto extends GetPaginatedBookingsInput {
  @ApiProperty({
    name: "page",
    description: "Página",
    example: 1,
  })
  declare page: number;

  @ApiProperty({
    name: "limit",
    description: "Limite",
    example: 10,
  })
  declare limit: number;

  @ApiProperty({
    name: "sortDir",
    description: "Direção da ordenação",
    enum: ["asc", "desc"],
  })
  declare sortDir?: SortDirection;

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
    example: "2021-10-10T10:00:00Z",
  })
  declare expectedPickUpDate: string;

  @ApiProperty({
    name: "expectedReturnDate",
    description: "Data de devolução esperada",
    example: "2021-10-10T10:00:00Z",
  })
  declare expectedReturnDate: string;

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
  })
  declare status: Relation<BookingStatus>;
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
