import { Module } from "@nestjs/common";
import { ConfigModule } from "@nest/config-module/config.module";
import { DatabaseModule } from "@nest/database-module/database.module";
import { AppointmentModule } from "@nest/appointment-module/appointment.module";

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, AppointmentModule],
})
export class AppModule {}
