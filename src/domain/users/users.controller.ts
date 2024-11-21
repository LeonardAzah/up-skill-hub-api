import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  CurrentUser,
  IdDto,
  PaginationDto,
  RequestUser,
  Role,
  Roles,
} from 'common';
import { Public } from 'common/Decorators/public.decorator';
import { LoginDto } from 'auth/dto/login.dto';
import { RemoveDto } from 'common/dto/remove.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { createParseFilePipe } from 'cloudinary/files/utils/file-validation.util';
import { FileSchema } from 'cloudinary/files/swagger/schemas/file.schema';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileSchema })
  @Post('profile')
  @UseInterceptors(FileInterceptor('profile'))
  async uploadProfile(
    @CurrentUser() { id }: RequestUser,
    @UploadedFile(createParseFilePipe('2MB', 'png', 'jpeg'))
    profile: Express.Multer.File,
  ) {
    return this.usersService.uploadProfile(id, profile);
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

  @Roles(Role.ADMIN, Role.TEACHER)
  @Get(':id')
  async findOne(@Param() { id }: IdDto) {
    return this.usersService.findOne(id);
  }

  @Patch()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.usersService.update(updateUserDto, user);
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
