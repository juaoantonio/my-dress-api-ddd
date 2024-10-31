import { Module } from "@nestjs/common";
import { ConfigModule } from "@nest/config-module/config.module";
import { DatabaseModule } from "@nest/database-module/database.module";
import { AppointmentModule } from "@nest/appointment-module/appointment.module";
import { DressModule } from "@nest/dress-module/dress.module";
import { ClutchModule } from "@nest/clutch-module/clutch.module";
import { AuthModule } from "@nest/auth-module/auth.module";
import { UsersModule } from "@nest/users-module/users.module";
import { BookingModule } from "@nest/booking-module/booking.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    AuthModule,
    AppointmentModule,
    BookingModule,
    DressModule,
    ClutchModule,
    UsersModule,
  ],
})
export class AppModule {}
