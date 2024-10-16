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

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param() { id }: IdDto) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param() { id }: IdDto, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param() { id }: IdDto) {
    return this.usersService.remove(id);
  }
}
