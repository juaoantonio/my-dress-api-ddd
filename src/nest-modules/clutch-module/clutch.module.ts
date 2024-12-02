import { Module } from "@nestjs/common";
import { ClutchController } from "./clutch.controller";
import { CLUTCH_PROVIDERS } from "@nest/clutch-module/clutch.provider";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClutchModel } from "@core/products/infra/db/typeorm/clutch/clutch.model";

@Module({
  imports: [TypeOrmModule.forFeature([ClutchModel])],
  exports: [
    ...Object.values(CLUTCH_PROVIDERS.REPOSITORIES),
    ...Object.values(CLUTCH_PROVIDERS.SERVICES),
  ],
  controllers: [ClutchController],
  providers: [
    ...Object.values(CLUTCH_PROVIDERS.REPOSITORIES),
    ...Object.values(CLUTCH_PROVIDERS.USE_CASES),
    ...Object.values(CLUTCH_PROVIDERS.SERVICES),
  ],
})
export class ClutchModule {}
