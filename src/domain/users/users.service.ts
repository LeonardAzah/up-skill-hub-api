import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FCMDto } from './dto/update-fcmtoken.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly paginationService: PaginationService,
    private readonly hashingService: HashingService,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto);
    await this.usersRepository.save(user);

    this.eventEmitter.emitAsync('user.registered', user);

    return user;
  }

  async createTeacher(createUserDto: CreateUserDto) {
    const user = new User({
      ...createUserDto,
      role: Role.INSTRUCTOR,
    });
    await this.usersRepository.save(user);

    this.eventEmitter.emitAsync('user.registered', user);

    return user;
  }

  async createAdmin(createUserDto: CreateUserDto) {
    const user = new User({
      ...createUserDto,
      role: Role.ADMIN,
    });
    await this.usersRepository.save(user);

    this.eventEmitter.emitAsync('user.registered', user);
    return user;
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

  async findOne(id: string) {
    return this.usersRepository.findOne({
      where: { id },
      select: { name: true, profile: true, email: true, role: true },
    });
  }

  async update(updateUserDto: UpdateUserDto, { id }: RequestUser) {
    return this.usersRepository.findOneAndUpdate({ id }, updateUserDto);
  }

  async updateFcmToken(id: string, { fcmToken }: FCMDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    user.fcmToken = fcmToken;
    return this.usersRepository.save(user);
  }

  async remove(id: string, soft: boolean, currentUser: RequestUser) {
    await compareUserId(currentUser, id);
    if (currentUser.role !== Role.ADMIN) {
      if (!soft) {
        throw new ForbiddenException('Forbidden resource');
      }
    }
    const user = await this.usersRepository.findOne({ where: { id } });
    return soft
      ? this.usersRepository.softRemove(user)
      : this.usersRepository.remove(user);
  }

  async recover(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({
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
    this.eventEmitter.emitAsync('count.recovered', user);

    return this.usersRepository.recover(user);
  }

  async uploadProfile(id: string, file: Express.Multer.File) {
    const folder = this.configService.get<string>('CLOUDINARY_FOLDER_PROFILES');
    const user = await this.usersRepository.findOne({ where: { id } });
    const imageData = await this.cloudinaryService.uploadFile(file, folder);
    user.profile = imageData.secure_url;
    await this.usersRepository.save(user);
    return { profile: user.profile };
  }
}
