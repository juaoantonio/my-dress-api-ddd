import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
  @ApiProperty({
    description: "Nome de usuário",
    example: "admin",
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: "Senha",
    example: "admin",
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
