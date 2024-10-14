import { ApiProperty, PartialType } from "@nestjs/swagger";
import { ClutchOutput } from "@core/products/application/clutch/common/clutch.output-mapper";
import { Type } from "class-transformer";
import { CreateClutchUseCaseInput } from "@core/products/application/clutch/create-clutch/create-clutch.use.case";
import { ImageFile } from "@nest/shared-module/decorators/uploaded-image-file.decorator";

export class ClutchDto extends ClutchOutput {
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

export class CreateClutchDto extends CreateClutchUseCaseInput {
  @ApiProperty({
    description: "Imagem da bolsa",
    type: "string",
    format: "binary",
  })
  declare image: ImageFile;

  @ApiProperty({
    description: "Cor da bolsa",
    example: "Branco",
  })
  declare color: string;

  @ApiProperty({
    description: "Modelo da bolsa",
    example: "Decote V",
  })
  declare model: string;

  @ApiProperty({
    description: "Preço de aluguel da bolsa",
    example: 200.0,
  })
  @Type(() => Number)
  declare rentPrice: number;
}

export class UpdateClutchDto extends PartialType(CreateClutchDto) {
  @ApiProperty({
    description: "Imagem da bolsa",
    type: "string",
    format: "binary",
  })
  declare image: ImageFile;

  @ApiProperty({
    description: "Cor da bolsa",
    example: "Branco",
  })
  declare color: string;

  @ApiProperty({
    description: "Modelo da bolsa",
    example: "Decote V",
  })
  declare model: string;

  @ApiProperty({
    description: "Preço de aluguel da bolsa",
    example: 200.0,
  })
  @Type(() => Number)
  declare rentPrice: number;
}
