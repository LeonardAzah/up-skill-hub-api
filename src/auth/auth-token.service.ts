import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'auth/interfaces/jwt-payload.interface';
import { LessThanOrEqual, MoreThan } from 'typeorm';
import { Response } from 'express';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthTokensRepository } from './authToken.repository';
import { AuthRefreshToken } from 'auth/entities/auth-refresh-token.entity';
import { HashingService } from 'common/hashing/hashing.service';

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly authTokensRepository: AuthTokensRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}

  async generateRefreshToken(
    payload: JwtPayload,
    expiresAt: Date,
    currentRefreshToken?: string,
  ): Promise<string> {
    const newRefreshToken = await this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_PRIVATE_KEY'),
      expiresIn: '30d',
    });

    if (currentRefreshToken) {
      const tokenExists = await this.refreshTokenExists(
        currentRefreshToken,
        payload.sub,
      );

      if (!tokenExists) {
        throw new UnauthorizedException('Refresh token not found or invalid');
      }

      await this.authTokensRepository.deleteBy({
        refreshToken: currentRefreshToken,
      });
    }

    const newTokenEntry = new AuthRefreshToken({
      refreshToken: newRefreshToken,
      expiresAt,
      userId: payload.sub,
    });

    await this.authTokensRepository.save(newTokenEntry);

    return newRefreshToken;
  }

  async generateTokenPair(
    payload: JwtPayload,
    response: Response,
    currentRefreshToken?: string,
  ) {
    const accessTokenExpires = new Date();
    accessTokenExpires.setSeconds(
      accessTokenExpires.getSeconds() +
        this.configService.get('JWT_EXPIRATION'),
    );

    const refreshTokenExpires = new Date();

    refreshTokenExpires.setSeconds(
      refreshTokenExpires.getSeconds() +
        this.configService.get('REFRESH_JWT_EXPIRATION'),
    );

    const accessToken = this.jwtService.sign(payload);
    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      expires: accessTokenExpires,
    });

    const refreshToken = await this.generateRefreshToken(
      payload,
      refreshTokenExpires,
      currentRefreshToken,
    );
    response.cookie('AuthenticationRefreshToken', refreshToken, {
      httpOnly: true,
      expires: refreshTokenExpires,
    });
  }

  async refreshTokenExists(
    refreshToken: string,
    userId: string,
  ): Promise<boolean> {
    const token = await this.authTokensRepository.findOneById({
      where: {
        refreshToken,
        userId,
        expiresAt: MoreThan(new Date()),
      },
    });

    return !!token;
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async clearExpiredRefreshtokens() {
    await this.authTokensRepository.delete({
      expiresAt: LessThanOrEqual(new Date()),
    });
  }
}
