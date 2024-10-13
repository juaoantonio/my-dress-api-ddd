import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
  @ApiProperty({
    description: "Nome de usuário",
    example: "john_doe",
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: "Senha",
    example: "password",
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
