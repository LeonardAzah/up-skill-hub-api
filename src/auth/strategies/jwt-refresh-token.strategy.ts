import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'auth/auth.service';
import { JwtPayload } from 'auth/interfaces/jwt-payload.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { log } from 'console';

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
        (request: Request) =>
          request?.cookies?.AuthenticationRefreshToken ||
          request?.headers?.AuthenticationRefreshToken,
      ]),
      secretOrKey: configService.get('REFRESH_TOKEN_PRIVATE_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    try {
      const refreshToken =
        request?.cookies?.AuthenticationRefreshToken ||
        request?.headers?.AuthenticationRefreshToken;

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not provided');
      }

      return this.authService.validateRefreshJwt(refreshToken, payload);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
