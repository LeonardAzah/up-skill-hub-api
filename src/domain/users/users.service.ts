import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.reposisoty';
import { User } from './entities/user.entity';
import { DefaultPageSize, PaginationDto, PaginationService } from 'common';
import { Role } from 'common/enums/roles.enum';
import { LoginDto } from 'auth/dto/login.dto';
import { HashingService } from 'common/hashing/hashing.service';
import { RequestUser } from 'common/interfaces/request-user.interface';
import { compareUserId } from 'common/utils/authorization.util';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly paginationService: PaginationService,
    private readonly hashingService: HashingService,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto);
    return this.usersRepository.create(user);
  }

  async createTeacher(createUserDto: CreateUserDto) {
    const user = new User({
      ...createUserDto,
      role: Role.TEACHER,
    });
    return this.usersRepository.create(user);
  }

  async createAdmin(createUserDto: CreateUserDto) {
    const user = new User({
      ...createUserDto,
      role: Role.ADMIN,
    });
    return this.usersRepository.create(user);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page } = paginationDto;
    const limit = paginationDto.limit ?? DefaultPageSize.USER;
    const offset = this.paginationService.calculateOffset(limit, page);
    const result = await this.usersRepository.find({
      skip: offset,
      take: limit,
    });
    const meta = this.paginationService.createMeta(limit, page, result.count);
    return { data: result.data, meta };
  }

  async findOneById(id: string) {
    return this.usersRepository.findOneById({ where: { id } });
  }

  async update(updateUserDto: UpdateUserDto, { id }: RequestUser) {
    return this.usersRepository.findOneAndUpdate({ id }, updateUserDto);
  }

  async remove(id: string, soft: boolean, currentUser: RequestUser) {
    await compareUserId(currentUser, id);
    if (currentUser.role !== Role.ADMIN) {
      if (!soft) {
        throw new ForbiddenException('Forbidden resource');
      }
    }
    const user = await this.usersRepository.findOneById({ where: { id } });
    return soft
      ? this.usersRepository.softRemove(user)
      : this.usersRepository.remove(user);
  }

  async recover(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOneById({
      where: { email },
      withDeleted: true,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await this.hashingService.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isDeleted) {
      throw new ConflictException('User not deleted');
    }

    return this.usersRepository.recover(user);
  }

  async uploadProfile(id: string, file: Express.Multer.File) {
    const folder = this.configService.get<string>('CLOUDINARY_FOLDER_PROFILES');
    const user = await this.usersRepository.findOneById({ where: { id } });
    const imageData = await this.cloudinaryService.uploadFile(file, folder);
    user.profile = imageData.secure_url;
    return this.usersRepository.create(user);
  }
}
