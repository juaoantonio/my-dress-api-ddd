import { Module } from "@nestjs/common";
import { AppointmentController } from "./appointment.controller";
import { APPOINTMENT_PROVIDERS } from "@nest/appointment-module/appointment.provider";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";
import { AppointmentHistoryModel } from "@core/appointment/infra/db/typeorm/appointment-history.model";
import { BookingModel } from "@core/booking/infra/db/typeorm/booking.model";
import { BookingItemDressModel } from "@core/booking/infra/db/typeorm/booking-item-dress.model";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AppointmentModel,
      AppointmentHistoryModel,
      BookingModel,
      BookingItemDressModel,
    ]),
  ],
  controllers: [AppointmentController],
  providers: [
    ...Object.values(APPOINTMENT_PROVIDERS.REPOSITORIES),
    ...Object.values(APPOINTMENT_PROVIDERS.USE_CASES),
    ...Object.values(APPOINTMENT_PROVIDERS.OTHER_PROVIDERS),
  ],
})
export class AppointmentModule {}
