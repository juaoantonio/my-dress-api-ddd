import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "@nest/auth-module/dto/sign-in.dto";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "@nest/shared-module/decorators/public-route.decorator";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: "Fazer login" })
  @ApiBody({
    type: SignInDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}
