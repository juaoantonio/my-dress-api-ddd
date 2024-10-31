import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingModel } from "@core/booking/infra/db/typeorm/booking.model";
import { BOOKING_PROVIDERS } from "@nest/booking-module/booking.providers";
import { DressModule } from "@nest/dress-module/dress.module";
import { ClutchModule } from "@nest/clutch-module/clutch.module";
import { BookingItemDressModel } from "@core/booking/infra/db/typeorm/booking-item-dress.model";
import { BookingItemClutchModel } from "@core/booking/infra/db/typeorm/booking-item-clutch.model";
import { BookingController } from "@nest/booking-module/booking.controller";

@Module({
  imports: [
    DressModule,
    ClutchModule,
    TypeOrmModule.forFeature([
      BookingModel,
      BookingItemDressModel,
      BookingItemClutchModel,
    ]),
  ],
  providers: [
    ...Object.values(BOOKING_PROVIDERS.REPOSITORIES),
    ...Object.values(BOOKING_PROVIDERS.USE_CASES),
  ],
  controllers: [BookingController],
})
export class BookingModule {}
