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
import { ScheduleInitialVisitUseCase } from "@core/appointment/application/schedule-initial-visit/schedule-initial-visit.use.case";
import { RescheduleAppointmentUseCase } from "@core/appointment/application/reschedule/reschedule-appointment.use-case";
import { CancelAppointmentUseCase } from "@core/appointment/application/cancel/cancel-appointment.use-case";
import { CompleteAppointmentUseCase } from "@core/appointment/application/complete/complete-appointment.use-case";
import { RescheduleAppointmentDto } from "@nest/appointment-module/dto/reschedule-appointment.dto";
import { ScheduleInitialVisitDto } from "@nest/appointment-module/dto/schedule-initial-visit.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ScheduleAdjustmentReturnUseCase } from "@core/appointment/application/schedule-for-adjustment/schedule-adjustment-return.use-case";
import { ScheduleAdjustmentReturnDto } from "@nest/appointment-module/dto/schedule-adjustment-return.dto";
import { GetPaginatedAppointmentsUseCase } from "@core/appointment/application/get-paginated-appointments/get-paginated-appointments.use-case";
import { GetAppointmentUseCase } from "@core/appointment/application/get-appointment/get-appointment.use-case";
import { GetPaginatedDressesOutputDto } from "@nest/dress-module/dto/get-paginated-dresses.dto";
import {
  GetPaginatedAppointmentsInputDto,
  GetPaginatedAppointmentsOutputDto,
} from "@nest/appointment-module/get-paginated-appointments.dto";

@ApiBearerAuth()
@ApiTags("Agendamentos")
@Controller("appointments")
export class AppointmentController {
  @Inject(GetAppointmentUseCase)
  private getAppointmentUseCase: GetAppointmentUseCase;

  @Inject(GetPaginatedAppointmentsUseCase)
  private getPaginatedAppointmentsUseCase: GetPaginatedAppointmentsUseCase;

  @Inject(ScheduleInitialVisitUseCase)
  private scheduleInitialVisitUseCase: ScheduleInitialVisitUseCase;

  @Inject(RescheduleAppointmentUseCase)
  private rescheduleAppointmentUseCase: RescheduleAppointmentUseCase;

  @Inject(ScheduleAdjustmentReturnUseCase)
  private scheduleAdjustmentReturnUseCase: ScheduleAdjustmentReturnUseCase;

  @Inject(CancelAppointmentUseCase)
  private cancelAppointmentUseCase: CancelAppointmentUseCase;

  @Inject(CompleteAppointmentUseCase)
  private completeAppointmentUseCase: CompleteAppointmentUseCase;

  @ApiOperation({ summary: "Buscar um agendamento" })
  @ApiParam({
    name: "id",
    description: "ID do agendamento a ser buscado",
    type: String,
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @Get(":id")
  async getAppointment(@Param("id", new ParseUUIDPipe()) id: string) {
    return await this.getAppointmentUseCase.execute({ id });
  }

  @ApiOperation({
    summary: "Listar agendamentos com paginação",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Agendamentos listados com sucesso",
    type: GetPaginatedDressesOutputDto,
  })
  @Get()
  async getPaginatedDresses(
    @Query() query: GetPaginatedAppointmentsInputDto,
  ): Promise<GetPaginatedAppointmentsOutputDto> {
    const page = query.page || 1;
    const limit = query.limit || 15;
    return await this.getPaginatedAppointmentsUseCase.execute({
      page,
      limit,
      sort: query.sort,
      sortDir: query.sortDir,
      appointmentDate: query.appointmentDate,
      customerName: query.customerName,
    });
  }

  @Post("initial-visit")
  @ApiOperation({ summary: "Agendar uma visita inicial" })
  @ApiResponse({
    status: 201,
    description: "Visita inicial agendada com sucesso",
  })
  @ApiResponse({
    status: 422,
    description: "Entidade inválida",
  })
  async scheduleInitialVisit(
    @Body() scheduleInitialVisitInput: ScheduleInitialVisitDto,
  ) {
    await this.scheduleInitialVisitUseCase.execute(scheduleInitialVisitInput);
  }

  @Patch("reschedule/:appointmentId")
  @ApiOperation({ summary: "Reagendar um agendamento existente" })
  @ApiParam({
    name: "appointmentId",
    description: "ID do agendamento a ser reagendado",
    type: String,
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @ApiResponse({
    status: 200,
    description: "Agendamento reagendado com sucesso",
  })
  @ApiResponse({
    status: 422,
    description: "Entidade inválida",
  })
  @ApiResponse({
    status: 404,
    description: "Agendamento não encontrado",
  })
  async rescheduleAppointment(
    @Param("appointmentId", new ParseUUIDPipe()) appointmentId: string,
    @Body() input: RescheduleAppointmentDto,
  ): Promise<void> {
    await this.rescheduleAppointmentUseCase.execute({
      appointmentId,
      newDate: input.newDate,
    });
  }

  @Post("adjustment-return")
  @ApiOperation({
    summary: "Agendar retorno para ajuste a partir de uma reserva",
  })
  @ApiResponse({
    status: 201,
    description: "Retorno para ajuste agendado com sucesso",
  })
  @ApiResponse({
    status: 422,
    description: "Entidade inválida",
  })
  @ApiResponse({
    status: 404,
    description: "Reserva não encontrada",
  })
  async scheduleAdjustmentReturn(@Body() input: ScheduleAdjustmentReturnDto) {
    await this.scheduleAdjustmentReturnUseCase.execute({
      appointmentDate: input.appointmentDate,
      bookingId: input.bookingId,
    });
  }

  @Patch(":appointmentId/cancel")
  @ApiOperation({ summary: "Cancelar um agendamento" })
  @ApiParam({
    name: "appointmentId",
    description: "ID do agendamento a ser cancelado",
    example: "123e4567-e89b-12d3-a456-426614174000",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "Agendamento cancelado com sucesso.",
  })
  @ApiResponse({
    status: 400,
    description: "Dados inválidos fornecidos",
  })
  @ApiResponse({ status: 404, description: "Agendamento não encontrado." })
  async cancelAppointment(
    @Param("appointmentId", new ParseUUIDPipe()) appointmentId: string,
  ) {
    await this.cancelAppointmentUseCase.execute({ appointmentId });
  }

  @Patch(":appointmentId/complete")
  @ApiOperation({ summary: "Concluir um agendamento" })
  @ApiParam({
    name: "appointmentId",
    description: "ID do agendamento a ser concluído",
    type: String,
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @ApiResponse({
    status: 200,
    description: "Agendamento concluído com sucesso.",
  })
  @ApiResponse({
    status: 404,
    description: "Agendamento não encontrado.",
  })
  @ApiResponse({
    status: 400,
    description: "Dados inválidos fornecidos",
  })
  async completeAppointment(
    @Param("appointmentId", new ParseUUIDPipe()) appointmentId: string,
  ) {
    await this.completeAppointmentUseCase.execute({ appointmentId });
  }
}
