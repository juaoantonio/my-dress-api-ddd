import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { SignInDto } from "@nest/auth-module/dto/sign-in.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "@nest/shared-module/decorators/public-route.decorator";
import { ConfigService } from "@nestjs/config";
import { CONFIG_SCHEMA_TYPE } from "@nest/config-module/config.module";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService<CONFIG_SCHEMA_TYPE>,
  ) {}

  @Public()
  @ApiOperation({ summary: "Fazer login" })
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({
      passthrough: true,
    })
    res: Response,
  ) {
    const tokens = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: this.configService.get("NODE_ENV") === "production",
      sameSite: "none", // Necessário para cookies em requisições cross-origin
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
    });
    return tokens;
  }
}
