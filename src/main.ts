import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NotFoundFilter } from "@nest/shared-module/filters/not-found/not-found.filter";
import { EntityValidationErrorFilter } from "@nest/shared-module/filters/entity-validation-error/entity-validation-error.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new NotFoundFilter(), new EntityValidationErrorFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle("My Dress API")
    .setDescription(
      "API de gerenciamento de reservas para a loja de aluguel de vestidos e bolsas My Dress",
    )
    .setVersion("1.0")
    .addTag("my-dress")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);
  await app.listen(3000);
}
bootstrap();
