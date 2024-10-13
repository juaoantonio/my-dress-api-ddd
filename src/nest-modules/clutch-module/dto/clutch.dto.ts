import { ApiProperty } from "@nestjs/swagger";
import { ClutchOutput } from "@core/products/application/clutch/common/clutch.output-mapper";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { Type } from "class-transformer";

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

export class CreateClutchDto {
  @ApiProperty({
    description: "Cor da bolsa",
    example: "Branco",
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    description: "Modelo da bolsa",
    example: "Decote V",
  })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
    description: "Preço de aluguel da bolsa",
    example: 200.0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  rentPrice: number;
}

export class UpdateClutchDto {
  @ApiProperty({
    description: "ID da bolsa",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: "Cor da bolsa",
    example: "Branco",
  })
  @IsString()
  @IsOptional()
  color: string;

  @ApiProperty({
    description: "Modelo da bolsa",
    example: "Decote V",
  })
  @IsString()
  @IsOptional()
  model: string;

  @ApiProperty({
    description: "Preço de aluguel da bolsa",
    example: 200.0,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  rentPrice: number;
}
