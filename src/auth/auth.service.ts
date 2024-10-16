import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { HashingService } from 'common/hashing/hashing.service';
import { Response } from 'express';
import { User } from 'users/entities/user.entity';
import { UsersRepository } from 'users/users.reposisoty';
import { RequestUser } from './interfaces/request-user.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}

  async verifyuser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
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
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(payload);
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }

  async validateJwt(payload: JwtPayload) {
    const user = await this.usersRepository.findOne({ id: payload.sub });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return this.createRequestUser(user);
  }

  async getProfile(id: string) {
    return this.usersRepository.findOne({ id });
  }

  private createRequestUser(user: User) {
    const { id, role, email } = user;
    const requestUser: RequestUser = { id, role, email };
    return requestUser;
  }
}
