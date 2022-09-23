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
import { UpdateUserDto } from './dtos/update-user.dto';
import { GetAllDto } from './dtos/get-all.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(payload: CreateUserDto): Promise<UserDto> {
    let user = await this.userRepository.findOneBy({ email: payload.email });

    if (user)
      throw new RpcException(new ConflictException('The user already exist.'));

    payload.password = await hash(payload.password, 10);
    user = this.userRepository.create(payload);
    return this.userRepository.save(user);
  }

  async update(payload: UpdateUserDto): Promise<UserDto> {
    let user = await this.userRepository.findOneBy({ id: payload.id });

    if (!user)
      throw new RpcException(
        new NotFoundException('Could not found the user.'),
      );

    user = this.userRepository.create(payload);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user)
      throw new RpcException(
        new NotFoundException('Could not found the user.'),
      );

    return this.userRepository.remove(user);
  }

  async get(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user)
      throw new RpcException(
        new NotFoundException('Could not found the user.'),
      );

    return user;
  }

  async getAll(payload: GetAllDto): Promise<[UserDto[], number]> {
    return this.userRepository.findAndCount({
      take: payload.take,
      skip: payload.skip,
    });
  }
}

// async createUser(payload: CreateUserDto): Promise<UserDto> {
//   let user = await this.findByEmail(payload.email);

//   if (user)
//     throw new RpcException(new ConflictException('The user already exist.'));

//   payload.password = await hash(payload.password, 10);
//   user = this.userRepository.create(payload);
//   return this.userRepository.save(user);
// }

// async validateUser(payload: ValidateUserDto): Promise<UserDto> {
//   const user = await this.findByEmail(payload.email);

//   if (!user)
//     throw new RpcException(
//       new NotFoundException('Could not found the email.'),
//     );

//   const isPasswordsEqual = await compare(payload.password, user.password);

//   if (!isPasswordsEqual)
//     throw new RpcException(new NotFoundException(`The password is wrong.`));

//   return Object.assign(user, { password: payload.password });
// }

// findById(id: number): Promise<UserDto> {
//   return this.userRepository.findOne({ where: { id } });
// }

// findByEmail(email: string): Promise<UserDto> {
//   return this.userRepository.findOne({ where: { email } });
// }

// async resetPassword(payload: ResetPasswordDto): Promise<UserDto> {
//   const user = await this.findById(payload.userId);

//   if (!user)
//     throw new RpcException(
//       new NotFoundException('Cound not found the user.'),
//     );

//   user.password = await hash(payload.password, 10);
//   return this.userRepository.save(user);
// }
