import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'auth/auth.service';
import { JwtPayload } from 'auth/interfaces/jwt-payload.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.RefreshToken ||
          request?.RefreshToken ||
          request?.headers.RefreshToken,
      ]),
      secretOrKey: configService.get('REFRESH_TOKEN_PRIVATE_KEY'),
    });
  }
  async validate(payload: JwtPayload) {
    try {
      return await this.authService.validateRefreshJwt(payload);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
