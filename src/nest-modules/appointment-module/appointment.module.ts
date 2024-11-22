import { Module } from "@nestjs/common";
import { AppointmentController } from "./appointment.controller";
import { APPOINTMENT_PROVIDERS } from "@nest/appointment-module/appointment.provider";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";
import { AppointmentHistoryModel } from "@core/appointment/infra/db/typeorm/appointment-history.model";
import { BookingModel } from "@core/booking/infra/db/typeorm/booking.model";
import { BookingItemDressModel } from "@core/booking/infra/db/typeorm/booking-item-dress.model";
import { BookingModule } from "@nest/booking-module/booking.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AppointmentModel,
      AppointmentHistoryModel,
      BookingModel,
      BookingItemDressModel,
    ]),
    BookingModule,
  ],
  controllers: [AppointmentController],
  providers: [
    ...Object.values(APPOINTMENT_PROVIDERS.REPOSITORIES),
    ...Object.values(APPOINTMENT_PROVIDERS.USE_CASES),
  ],
})
export class AppointmentModule {}
