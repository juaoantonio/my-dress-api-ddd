import { Module } from "@nestjs/common";
import { ConfigModule } from "@nest/config-module/config.module";
import { DatabaseModule } from "@nest/database-module/database.module";

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule],
})
export class AppModule {}
