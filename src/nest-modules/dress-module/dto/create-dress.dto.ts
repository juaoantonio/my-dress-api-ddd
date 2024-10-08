import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

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
