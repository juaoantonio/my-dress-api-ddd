import { Module } from "@nestjs/common";
import { AppointmentController } from "./appointment.controller";
import { APPOINTMENT_PROVIDERS } from "@nest/appointment-module/appointment.provider";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";
import { AppointmentHistoryModel } from "@core/appointment/infra/db/typeorm/appointment-history.model";

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentModel, AppointmentHistoryModel]),
  ],
  controllers: [AppointmentController],
  providers: [
    ...Object.values(APPOINTMENT_PROVIDERS.REPOSITORIES),
    ...Object.values(APPOINTMENT_PROVIDERS.USE_CASES),
  ],
})
export class AppointmentModule {}
