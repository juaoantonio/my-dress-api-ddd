import { ApiProperty, PartialType } from "@nestjs/swagger";
import { DressOutput } from "@core/products/application/dress/common/dress.output-mapper";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";
import { ImageFile } from "@nest/shared-module/decorators/uploaded-image-file.decorator";
import { CreateDressUseCaseInput } from "@core/products/application/dress/create-dress/create-dress.use.case";

export class DressDto extends DressOutput {
  @ApiProperty({
    description: "Identificador do vestido",
    example: "3d02de1e-2046-43ca-8d32-66b930f7a422",
  })
  declare id: string;

  @ApiProperty({
    description: "Preço do aluguel",
    example: 100,
  })
  declare rentPrice: number;

  @ApiProperty({
    description: "Nome do vestido",
    example: "Azul, Tomara que caia, Seda",
  })
  declare name: string;

  @ApiProperty({
    description: "Cor do vestido",
    example: "Azul",
  })
  declare color: string;

  @ApiProperty({
    description: "Modelo do vestido",
    example: "Tomara que caia",
  })
  declare model: string;

  @ApiProperty({
    description: "Tecido do vestido",
    example: "Seda",
  })
  declare fabric: string;

  @ApiProperty({
    description: "Vestido foi retirado",
    example: false,
  })
  declare isPickedUp: boolean;

  @ApiProperty({
    description: "URL da imagem do vestido",
    example: "https://url.com",
  })
  declare imagePath: string;

  @ApiProperty({
    description: "Tipo do produto",
    example: "dress",
  })
  declare type: string;
}

export class CreateDressDto extends CreateDressUseCaseInput {
  @ApiProperty({
    description: "Imagem do vestido",
    type: "string",
    format: "binary",
  })
  declare image: ImageFile;

  @ApiProperty({
    description: "Cor do vestido",
    example: "Branco",
  })
  declare color: string;

  @ApiProperty({
    description: "Tecido do vestido",
    example: "Seda",
  })
  @IsString()
  @IsNotEmpty()
  declare fabric: string;

  @ApiProperty({
    description: "Modelo do vestido",
    example: "Decote V",
  })
  @IsString()
  @IsNotEmpty()
  declare model: string;

  @ApiProperty({
    description: "Preço de aluguel do vestido",
    example: 200.0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  declare rentPrice: number;
}

export class UpdateDressDto extends PartialType(CreateDressDto) {
  @ApiProperty({
    description: "Imagem do vestido",
    type: "string",
    format: "binary",
  })
  declare image: ImageFile;

  @ApiProperty({
    description: "Cor do vestido",
    example: "Branco",
  })
  declare color: string;

  @ApiProperty({
    description: "Modelo do vestido",
    example: "Decote V",
  })
  declare model: string;

  @ApiProperty({
    description: "Tecido do vestido",
    example: "Seda",
  })
  declare fabric: string;

  @ApiProperty({
    description: "Preço de aluguel do vestido",
    example: 200.0,
  })
  @Type(() => Number)
  declare rentPrice: number;
}
