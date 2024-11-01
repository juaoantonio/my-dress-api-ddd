import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CreateBookingProcessUseCase } from "@core/booking/application/create-booking-process/create-booking-process.use-case";
import { InitBookingProcessUseCase } from "@core/booking/application/init-booking-process/init-booking-process.use-case";
import { AddBookingItemsUseCase } from "@core/booking/application/add-booking-items/add-booking-items.use-case";
import { AddAdjustmentsUseCase } from "@core/booking/application/add-adjustments/add-adjustments.use-case";
import { GetBookingUseCase } from "@core/booking/application/get-booking/get-booking.use-case";
import {
  CreateBookingProcessInputDto,
  CreateBookingProcessOutputDto,
} from "@nest/booking-module/dto/create-booking-process.dto";
import { AddBookingItemsInputDto } from "@nest/booking-module/dto/add-booking-items.dto";
import {
  AddAdjustmentInputDto,
  AddAdjustmentOutputDto,
} from "@nest/booking-module/dto/add-adjustment.dto";
import { BookingOutputDto } from "@nest/booking-module/dto/booking.dto";
import { GetPaginatedBookingsUseCase } from "@core/booking/application/get-paginated-bookings/get-paginated-bookings.use-case";
import {
  GetPaginatedBookingsInputDto,
  GetPaginatedBookingsOutputDto,
} from "@nest/booking-module/dto/get-paginated-bookings.dto";

@ApiBearerAuth()
@ApiTags("Reservas")
@Controller("bookings")
export class BookingController {
  @Inject(CreateBookingProcessUseCase)
  private readonly createBookingProcessUseCase: CreateBookingProcessUseCase;

  @Inject(InitBookingProcessUseCase)
  private readonly initBookingProcessUseCase: InitBookingProcessUseCase;

  @Inject(AddBookingItemsUseCase)
  private readonly addBookingItemsUseCase: AddBookingItemsUseCase;

  @Inject(AddAdjustmentsUseCase)
  private readonly addAdjustmentsUseCase: AddAdjustmentsUseCase;

  @Inject(GetPaginatedBookingsUseCase)
  private readonly getPaginatedBookingsUseCase: GetPaginatedBookingsUseCase;

  @Inject(GetBookingUseCase)
  private readonly getBookingUseCase: GetBookingUseCase;

  @ApiOperation({ summary: "Criar processo de reserva" })
  @ApiConsumes("application/json", "multipart/form-data")
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Reserva criada com sucesso",
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Entidade Inválida",
  })
  @Post()
  async createBookingProcess(
    @Body() input: CreateBookingProcessInputDto,
  ): Promise<CreateBookingProcessOutputDto> {
    return await this.createBookingProcessUseCase.execute(input);
  }

  @ApiOperation({ summary: "Iniciar processo de reserva" })
  @ApiConsumes("application/json", "multipart/form-data")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Processo de reserva iniciado com sucesso",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Reserva não encontrada",
  })
  @Patch(":bookingId/init")
  async initBookingProcess(
    @Param("bookingId", new ParseUUIDPipe()) bookingId: string,
  ) {
    return await this.initBookingProcessUseCase.execute({
      bookingId: bookingId,
    });
  }

  @ApiOperation({ summary: "Adicionar itens à reserva" })
  @ApiConsumes("application/json", "multipart/form-data")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Itens adicionados à reserva com sucesso",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Reserva não encontrada",
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Entidade inválida",
  })
  @Patch(":bookingId/items")
  async addBookingItems(
    @Param("bookingId", new ParseUUIDPipe()) bookingId: string,
    @Body() input: AddBookingItemsInputDto,
  ) {
    return await this.addBookingItemsUseCase.execute({
      bookingId: bookingId,
      dressIds: input.dressIds,
      clutchIds: input.clutchIds,
    });
  }

  @ApiOperation({ summary: "Adicionar ajustes aos vestidos da reserva" })
  @ApiConsumes("application/json", "multipart/form-data")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ajustes adicionados com sucesso",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Reserva não encontrada",
  })
  @Patch(":bookingId/adjustments")
  async addAdjustments(
    @Param("bookingId", new ParseUUIDPipe()) bookingId: string,
    @Body() input: AddAdjustmentInputDto,
  ): Promise<AddAdjustmentOutputDto> {
    return await this.addAdjustmentsUseCase.execute({
      bookingId,
      adjustments: input.adjustments,
    });
  }

  @ApiOperation({ summary: "Buscar reservas paginadas" })
  @ApiConsumes("application/json", "multipart/form-data")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Reservas encontradas com sucesso",
  })
  @Get()
  async getPaginatedBookings(
    @Query() input: GetPaginatedBookingsInputDto,
  ): Promise<GetPaginatedBookingsOutputDto> {
    return await this.getPaginatedBookingsUseCase.execute({
      page: input.page,
      limit: input.limit,
      sortDir: input.sortDir,
      customerName: input.customerName,
      eventDate: input.eventDate,
      expectedPickUpDate: input.expectedPickUpDate,
      expectedReturnDate: input.expectedReturnDate,
      status: input.status,
    });
  }

  @ApiOperation({ summary: "Buscar uma reserva" })
  @ApiConsumes("application/json", "multipart/form-data")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Reserva encontrada com sucesso",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Reserva não encontrada",
  })
  @Get(":id")
  async getBooking(
    @Param("id", new ParseUUIDPipe()) id: string,
  ): Promise<BookingOutputDto> {
    return await this.getBookingUseCase.execute({ id });
  }
}
