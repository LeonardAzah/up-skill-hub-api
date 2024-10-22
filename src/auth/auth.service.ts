import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HashingService } from 'common/hashing/hashing.service';
import { Response } from 'express';
import { User } from 'users/entities/user.entity';
import { UsersRepository } from 'users/users.reposisoty';
import { RequestUser } from './interfaces/request-user.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthTokenService } from './auth-token.service';
import { AuthTokensRepository } from './authToken.repository';
import { RefreshUser } from './interfaces/rerefresh-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authTokensRepository: AuthTokensRepository,
    private readonly hashingService: HashingService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  async verifyuser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    const passwordIsValid = await this.hashingService.compare(
      password,
      user.password,
    );
    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    return this.createRequestUser(user);
  }

  async login(user: RequestUser, response: Response) {
    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
      email: user.email,
    };
    return this.authTokenService.generateTokenPair(payload, response);
  }

  async logout(user: RequestUser, response: Response, refreshToken: string) {
    await this.authTokensRepository.findOneAndDelete({
      userId: user.id,
      refreshToken,
    });
    response.cookie('Authentication', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    response.cookie('AuthenticationRefreshToken', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    return { msg: 'user logged out!' };
  }

  async validateJwt(payload: JwtPayload) {
    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return this.createRequestUser(user);
  }

  async refreshTokens(user: RefreshUser, response: Response) {
    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
      email: user.email,
    };
    return this.authTokenService.generateTokenPair(
      payload,
      response,
      user.refreshToken,
    );
  }

  async validateRefreshJwt(refreshToken: string, payload: JwtPayload) {
    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });

    const tokenExist = this.authTokenService.refreshTokenExists(
      refreshToken,
      payload.sub,
    );

    if (!tokenExist) {
      throw new UnauthorizedException('Invalid token');
    }
    const newUser = await this.createRequestUser(user);

    return { ...newUser, refreshToken };
  }

  async getProfile(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  private createRequestUser(user: User) {
    const { id, role, email } = user;
    const requestUser: RequestUser = { id, role, email };
    return requestUser;
  }
}
