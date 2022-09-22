import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { compare, hash } from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { UserDto } from './dtos/user-dto';
import { ValidateUserDto } from './dtos/validate-user.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(payload: CreateUserDto): Promise<UserDto> {
    const user = await this.findByEmail(payload.email);

    if (user) {
      throw new RpcException(new ConflictException('The user already exist.'));
    }

    const hashedPassword = await hash(payload.password, 10);

    const createdUser = this.userRepository.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: hashedPassword,
      phone: payload.phone,
    });

    return this.userRepository.save(createdUser);
  }

  async validateUser(payload: ValidateUserDto): Promise<UserDto> {
    const user = await this.findByEmail(payload.email);

    if (!user)
      throw new RpcException(
        new NotFoundException('Could not found the email.'),
      );

    const isPasswordsEqual = await compare(payload.password, user.password);

    if (!isPasswordsEqual)
      throw new RpcException(new NotFoundException(`The password is wrong.`));

    return Object.assign(user, { password: payload.password });
  }

  findById(id: number): Promise<UserDto> {
    return this.userRepository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<UserDto> {
    return this.userRepository.findOne({ where: { email } });
  }

  async resetPassword(payload: ResetPasswordDto): Promise<UserDto> {
    const user = await this.findById(payload.userId);

    if (!user)
      throw new RpcException(
        new NotFoundException('Cound not found the user.'),
      );

    user.password = payload.password;
    return this.userRepository.save(user);
  }
}
