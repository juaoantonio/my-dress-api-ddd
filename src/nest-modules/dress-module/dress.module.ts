import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DressModel } from "@core/products/infra/db/typeorm/dress/dress.model";
import { DressController } from "@nest/dress-module/dress.controller";
import { DRESS_PROVIDERS } from "@nest/dress-module/dress.provider";

@Module({
  imports: [TypeOrmModule.forFeature([DressModel])],
  exports: [...Object.values(DRESS_PROVIDERS.REPOSITORIES)],
  controllers: [DressController],
  providers: [
    ...Object.values(DRESS_PROVIDERS.REPOSITORIES),
    ...Object.values(DRESS_PROVIDERS.USE_CASES),
    ...Object.values(DRESS_PROVIDERS.SERVICES),
  ],
})
export class DressModule {}
