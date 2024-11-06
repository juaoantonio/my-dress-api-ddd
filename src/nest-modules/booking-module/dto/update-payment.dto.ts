import { IsNumber, IsPositive } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePaymentInputDto {
  @ApiProperty({
    description: "Quantidade a ser paga",
    example: 100,
  })
  @IsPositive()
  @IsNumber()
  amount: number;
}
