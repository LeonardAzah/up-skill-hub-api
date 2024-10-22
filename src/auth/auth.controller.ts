import {
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
import { CurrentUser } from 'auth/decorators/current-user.decorator';
import { Response, Request } from 'express';
import { RequestUser } from './interfaces/request-user.interface';
import { Public } from './decorators/public.decorator';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { JwtCookieHeader } from './swagger/jwt-cookie.header';
import { log } from 'console';
import { RefreshUser } from './interfaces/rerefresh-user.interface';

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

  @Get('profile')
  getProfile(@CurrentUser() { id }: RequestUser) {
    return this.authService.getProfile(id);
  }
}
