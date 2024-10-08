import { Module } from "@nestjs/common";
import { ConfigModule } from "@nest/config-module/config.module";
import { DatabaseModule } from "@nest/database-module/database.module";
import { AppointmentModule } from "@nest/appointment-module/appointment.module";
import { DressModule } from "@nest/dress-module/dress.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    AppointmentModule,
    DressModule,
  ],
})
export class AppModule {}
