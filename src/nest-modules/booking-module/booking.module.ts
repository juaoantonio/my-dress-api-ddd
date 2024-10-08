import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingModel } from "@core/booking/infra/db/typeorm/booking.model";

@Module({
  imports: [TypeOrmModule.forFeature([BookingModel])],
})
export class BookingModule {}
