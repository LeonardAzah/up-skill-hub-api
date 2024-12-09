import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from 'common/Decorators/current-user.decorator';
import { Response, Request } from 'express';
import { RequestUser } from '../common/interfaces/request-user.interface';
import { Public } from '../common/Decorators/public.decorator';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { JwtCookieHeader } from './swagger/jwt-cookie.header';
import { RefreshUser } from './interfaces/rerefresh-user.interface';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GoogleRegisterDto } from './dto/google-register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    headers: JwtCookieHeader,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(
    @CurrentUser() user: RequestUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return this.authService.forgotPassword(email);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('verify-otp')
  async verifyOtp(@Body() { email, otp }: VerifyOtpDto) {
    return this.authService.verifyOtp(email, otp);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ApiOkResponse({
    headers: JwtCookieHeader,
  })
  @Delete('logout')
  async logout(
    @CurrentUser() user: RequestUser,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const refreshToken =
      request?.cookies?.AuthenticationRefreshToken ||
      request?.headers.AuthenticationRefreshToken;
    return this.authService.logout(user, response, refreshToken);
  }

  @ApiOkResponse({
    headers: JwtCookieHeader,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshAuthGuard)
  @Public()
  @Post('refresh-tokens')
  async refreshTokens(
    @CurrentUser() user: RefreshUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.refreshTokens(user, response);
    const userData: RequestUser = {
      id: user.id,
      role: user.role,
      email: user.email,
    };
    response.send(userData);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user: GoogleRegisterDto = {
      name: req.user.name,
      email: req.user.email,
      profile: req.user.profile,
      providerId: req.user.providerId,
    };
    return this.authService.googleLogin(user, response);
  }

  @Get('profile')
  getProfile(@CurrentUser() { id }: RequestUser) {
    return this.authService.getProfile(id);
  }
}
