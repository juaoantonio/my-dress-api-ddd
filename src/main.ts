import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NotFoundFilter } from "@nest/shared-module/filters/not-found/not-found.filter";
import { EntityValidationErrorFilter } from "@nest/shared-module/filters/entity-validation-error/entity-validation-error.filter";
import { InvalidVoParamsErrorFilter } from "@nest/shared-module/filters/invalid-param/invalid-vo-params.filter";
import { ConfigService } from "@nestjs/config";
import { CONFIG_SCHEMA_TYPE } from "@nest/config-module/config.module";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService<CONFIG_SCHEMA_TYPE> =
    app.get(ConfigService);
  const corsOrigin = configService.get("CORS_ORIGIN");
  const environment = configService.get("NODE_ENV");
  const port = configService.get("PORT");
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalFilters(
    new NotFoundFilter(),
    new EntityValidationErrorFilter(),
    new InvalidVoParamsErrorFilter(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const config = new DocumentBuilder()
    .setTitle("My Dress API")
    .setDescription(
      "API de gerenciamento de reservas para a loja de aluguel de vestidos e bolsas My Dress",
    )
    .addBearerAuth()
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);
  await app.listen(port, () =>
    console.log(
      `Servidor rodando em http://0.0.0.0:${port}. Ambiente: ${environment}. Cors: ${corsOrigin.join(`, `)}`,
    ),
  );
}

bootstrap();
