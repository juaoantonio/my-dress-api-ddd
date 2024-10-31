import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NotFoundFilter } from "@nest/shared-module/filters/not-found/not-found.filter";
import { EntityValidationErrorFilter } from "@nest/shared-module/filters/entity-validation-error/entity-validation-error.filter";
import { InvalidVoParamsErrorFilter } from "@nest/shared-module/filters/invalid-param/invalid-vo-params.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? "https://prosuite.mydressbelem.com.br"
          : "*",
    },
  });
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
  await app.listen(3000);
}

bootstrap();
