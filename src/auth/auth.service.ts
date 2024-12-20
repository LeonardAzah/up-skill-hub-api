import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingService } from 'common/hashing/hashing.service';
import { Response } from 'express';
import { User } from 'users/entities/user.entity';
import { UsersRepository } from 'users/users.reposisoty';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthTokenService } from './auth-token.service';
import { AuthTokensRepository } from './authToken.repository';
import { RefreshUser } from './interfaces/rerefresh-user.interface';
import { GoogleRegisterDto } from './dto/google-register.dto';
import { Role } from '../common/enums/roles.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { generate } from 'otp-generator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ForgotPasswordEmitterPayload } from './interfaces/forgot-password.interface';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authTokensRepository: AuthTokensRepository,
    private readonly hashingService: HashingService,
    private readonly authTokenService: AuthTokenService,
    private readonly notificationsService: NotificationsService,
    private eventEmitter: EventEmitter2,
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

  async googleLogin(googleUser: GoogleRegisterDto, response: Response) {
    let user;
    user = await this.usersRepository.findByEmail({
      email: googleUser.email,
    });

    if (!user) {
      user = new User({
        ...googleUser,
        role: Role.STUDENT,
      });
      await this.usersRepository.save(user);
    }
    const requestUser = this.createRequestUser(user);
    await this.login(requestUser, response);
    return requestUser;
  }

  async getProfile(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async forgotPassword(email: string) {
    const user = await this.usersRepository.findByEmail({ email });

    if (user) {
      const otp = generate(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      const tenMinutes = 1000 * 60 * 10;
      const otpVerificationExpirationDate = new Date(Date.now() + tenMinutes);

      user.otpVerification = await this.hashingService.hash(otp);
      user.otpVerificationExpirationDate = otpVerificationExpirationDate;
      await this.usersRepository.save(user);

      const payload: ForgotPasswordEmitterPayload = {
        name: user.name,
        otp,
        email,
      };

      this.eventEmitter.emitAsync('forgot.password', payload);
    }

    return 'Please check your email for reset password code';
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.usersRepository.findByEmail({ email });

    if (!user || !user.otpVerification) {
      throw new BadRequestException('OTP not set or expired.');
    }

    const otpValid = await this.hashingService.compare(
      otp,
      user.otpVerification,
    );
    const otpExpired = new Date() > user.otpVerificationExpirationDate;

    if (!otpValid) {
      throw new BadRequestException('Invalid OTP');
    }

    if (otpExpired) {
      throw new BadRequestException(
        'OTP has expired. Please request a new one.',
      );
    }

    const tenMinutes = 1000 * 60 * 10;
    const resetTokenExpires = new Date(Date.now() + tenMinutes);

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;

    user.otpVerification = null;
    user.otpVerificationExpirationDate = null;

    await this.usersRepository.save(user);

    return { msg: 'OTP verified successfully.', resetToken };
  }

  async resetPassword({ email, password, token }: ResetPasswordDto) {
    const user = await this.usersRepository.findByEmail({ email });
    if (!user) {
      throw new BadRequestException('Invalid input');
    }

    if (
      !user.passwordResetToken ||
      user.passwordResetToken !== token ||
      new Date() > user.resetTokenExpires
    ) {
      throw new BadRequestException('Invalid or expired reset token.');
    }

    user.password = password;

    user.passwordResetToken = null;
    user.resetTokenExpires = null;

    await this.usersRepository.save(user);
    return 'Your password has been successfully reset.';
  }

  private createRequestUser(user: User) {
    const { id, role, email } = user;
    const requestUser: RequestUser = { id, role, email };
    return requestUser;
  }
}
