import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

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
