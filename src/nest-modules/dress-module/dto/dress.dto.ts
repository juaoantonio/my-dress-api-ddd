import { ApiProperty } from "@nestjs/swagger";
import { DressOutput } from "@core/products/application/dress/common/dress.output-mapper";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { Type } from "class-transformer";

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

export class CreateDressDto {
  @ApiProperty({
    description: "Cor do vestido",
    example: "Branco",
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    description: "Tecido do vestido",
    example: "Seda",
  })
  @IsString()
  @IsNotEmpty()
  fabric: string;

  @ApiProperty({
    description: "Modelo do vestido",
    example: "Decote V",
  })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
    description: "Preço de aluguel do vestido",
    example: 200.0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  rentPrice: number;
}

export class UpdateDressDto {
  @ApiProperty({
    description: "ID do vestido",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: "Cor do vestido",
    example: "Branco",
  })
  @IsString()
  @IsOptional()
  color: string;

  @ApiProperty({
    description: "Modelo do vestido",
    example: "Decote V",
  })
  @IsString()
  @IsOptional()
  model: string;

  @ApiProperty({
    description: "Tecido do vestido",
    example: "Seda",
  })
  @IsString()
  @IsOptional()
  fabric: string;

  @ApiProperty({
    description: "Preço de aluguel do vestido",
    example: 200.0,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  rentPrice: number;
}