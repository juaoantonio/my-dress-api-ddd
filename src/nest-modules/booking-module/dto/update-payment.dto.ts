import { IsNumber, IsPositive } from "class-validator";

export class UpdatePaymentInputDto {
  @IsPositive()
  @IsNumber()
  amount: number;
}
