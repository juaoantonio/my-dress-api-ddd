import { IsDateString, IsNotEmpty, IsUUID } from "class-validator";
import { IAppointmentRepository } from "@core/appointment/domain/appointment.repository";
import { IUseCase } from "@core/@shared/application/use-case.interface";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import {
  Appointment,
  AppointmentType,
} from "@core/appointment/domain/appointment.aggregate";
import { Booking, BookingId } from "@core/booking/domain/booking.aggregate";
import { EntityValidationError } from "@core/@shared/domain/validators/validation.error";
import { IBookingRepository } from "@core/booking/domain/booking.repository";
import { EntityNotFoundError } from "@core/@shared/domain/error/entity-not-found.error";

export class ScheduleAdjustmentReturnInput {
  @IsUUID()
  @IsNotEmpty()
  bookingId: string;

  @IsDateString()
  @IsNotEmpty()
  returnDate: string;
}

export class ScheduleAdjustmentReturnUseCase
  implements IUseCase<ScheduleAdjustmentReturnInput, Promise<void>>
{
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(input: ScheduleAdjustmentReturnInput): Promise<void> {
    const bookingId = BookingId.create(input.bookingId);
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new EntityNotFoundError(bookingId, Booking);
    }
    const appointment = Appointment.create({
      bookingId: BookingId.create(input.bookingId),
      appointmentDate: DateVo.create(input.returnDate),
      customerName: booking.getCustomerName(),
      eventDate: booking.getEventDate(),
      type: AppointmentType.RETURN_FOR_ADJUSTMENT,
    });
    if (appointment.notification.hasErrors())
      throw new EntityValidationError(appointment.notification.toJSON());
    await this.appointmentRepository.save(appointment);
  }
}
