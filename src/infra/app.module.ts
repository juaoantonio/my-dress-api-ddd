import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { SqliteDriver } from "@mikro-orm/sqlite";

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: ["./dist/infra/db/mikro/models/**/*.model.js"],
      entitiesTs: ["./src/infra/db/mikro/models/**/*.model.ts"],
      baseDir: process.cwd(),
      driver: SqliteDriver,
      host: ":memory:",
      autoLoadEntities: true,
      dbName: "memory",
    }),
  ],
})
export class AppModule {}
