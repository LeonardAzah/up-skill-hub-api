import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { User } from 'users/entities/user.entity';
import { UsersRepository } from 'users/users.reposisoty';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async verifyuser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    return user;
  }

  async login(user: User, response: Response) {
    const payload = {
      userId: user.id,
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
}
