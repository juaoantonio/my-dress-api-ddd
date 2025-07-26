import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { CONFIG_SCHEMA_TYPE } from "@nest/config-module/config.module";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "@nest/shared-module/decorators/public-route.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<CONFIG_SCHEMA_TYPE>,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromRequest(request);
    if (!token) {
      throw new UnauthorizedException("Token ausente");
    }

    try {
      request["user"] = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get("JWT_SECRET"),
      });
    } catch {
      throw new UnauthorizedException("Token inválido ou expirado");
    }

    return true;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    // 🔐 1. Prioriza cookie
    const cookieToken = request.cookies?.accessToken;
    if (cookieToken) return cookieToken;

    // 🔁 2. Fallback para Authorization header
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
