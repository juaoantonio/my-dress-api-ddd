import { Booking, BookingId } from "@core/booking/domain/booking.aggregate";
import { IRepository } from "@core/@shared/domain/repository/repository.interface";

export interface IBookingRepository extends IRepository<BookingId, Booking> {}
