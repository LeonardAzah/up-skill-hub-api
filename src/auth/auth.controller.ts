import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from 'auth/decorators/current-user.decorator';
import { User } from 'users/entities/user.entity';
import { Response } from 'express';
import { RequestUser } from './interfaces/request-user.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    headers: {
      'Set-Cookie': { description: 'JWT cookie', schema: { type: 'string' } },
    },
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

  @Get('profile')
  getProfile(@CurrentUser() { id }: RequestUser) {
    return this.authService.getProfile(id);
  }
}
