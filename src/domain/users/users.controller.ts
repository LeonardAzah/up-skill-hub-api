import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdDto, PaginationDto } from 'common';
import { Public } from 'auth/decorators/public.decorator';
import { Role } from 'auth/roles/enums/roles.enum';
import { User } from './entities/user.entity';
import { Roles } from 'auth/decorators/roles.decorator';
import { CurrentUser } from 'auth/decorators/current-user.decorator';
import { RequestUser } from 'auth/interfaces/request-user.interface';
import { LoginDto } from 'auth/dto/login.dto';
import { RemoveDto } from 'common/dto/remove.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Public()
  @Post('teacher')
  async createTeacher(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createTeacher(createUserDto);
  }
  @Public()
  @Post('admin')
  async createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createAdmin(createUserDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Public()
  @Patch('recover')
  recover(@Body() loginDto: LoginDto) {
    return this.usersService.recover(loginDto);
  }

  @Get(':id')
  async findOne(@Param() { id }: IdDto) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param() { id }: IdDto,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  async remove(
    @Param() { id }: IdDto,
    @Query() { soft }: RemoveDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.usersService.remove(id, soft, user);
  }
}
