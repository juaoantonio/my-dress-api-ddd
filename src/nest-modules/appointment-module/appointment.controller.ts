import {
  Body,
  Controller,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ScheduleInitialVisitUseCase } from "@core/appointment/application/schedule-initial-visit/schedule-initial-visit.use.case";
import { RescheduleAppointmentUseCase } from "@core/appointment/application/reschedule/reschedule-appointment.use-case";
import { CancelAppointmentUseCase } from "@core/appointment/application/cancel/cancel-appointment.use-case";
import { CompleteAppointmentUseCase } from "@core/appointment/application/complete/complete-appointment.use-case";
import { RescheduleAppointmentDto } from "@nest/appointment-module/dto/reschedule-appointment.dto";
import { ScheduleInitialVisitDto } from "@nest/appointment-module/dto/schedule-initial-visit.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ScheduleAdjustmentReturnUseCase } from "@core/appointment/application/schedule-for-adjustment/schedule-adjustment-return.use-case";
import { ScheduleAdjustmentReturnDto } from "@nest/appointment-module/dto/schedule-adjustment-return.dto";

@ApiBearerAuth()
@ApiTags("Agendamentos")
@Controller("appointments")
export class AppointmentController {
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

  @Post("initial-visit")
  @ApiOperation({ summary: "Agendar uma visita inicial" })
  @ApiBody({
    type: ScheduleInitialVisitDto,
    description: "Dados necessários para agendar uma visita inicial",
  })
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
  @ApiBody({
    type: RescheduleAppointmentDto,
    description: "Dados necessários para reagendar o agendamento",
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
  @ApiBody({
    type: ScheduleAdjustmentReturnDto,
    description: "Dados necessários para agendar um retorno para ajuste",
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
