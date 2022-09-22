import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { LoginDto } from './dtos/login.dto';
import { MessageDto } from './dtos/message.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { SignupDto } from './dtos/signup.dto';
import { TokenDto } from './dtos/token.dto';
import { UserDto } from './dtos/user.dto';
import { ResetPassword } from './entities/reset-password.entity';
import { excpetion } from './libs/exception';
import { User } from './types/user';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly clientProxy: ClientProxy,
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>,
    private readonly jwtService: JwtService,
  ) {}

  getHello(currentUser: User): string {
    return `hello ${currentUser.firstName} ${currentUser.lastName}`;
  }

  async signup(body: SignupDto): Promise<UserDto> {
    try {
      const user: UserDto = await this.clientProxy
        .send('user_creation', body)
        .toPromise();

      return user;
    } catch (error) {
      excpetion(error);
    }
  }

  async login(body: LoginDto): Promise<TokenDto> {
    try {
      const user: UserDto = await this.clientProxy
        .send('validate_user', body)
        .toPromise();

      const userInfo = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      const accessToken = this.jwtService.sign(userInfo);
      const expiration = process.env.JWT_EXPIRATION;
      return { accessToken, expiration };
    } catch (error) {
      excpetion(error);
    }
  }

  async findById(id: number): Promise<UserDto> {
    try {
      const user: UserDto = await this.clientProxy
        .send('find_by_id', id)
        .toPromise();

      return user;
    } catch (error) {
      excpetion(error);
    }
  }

  async forgotPassword(body: ForgotPasswordDto): Promise<MessageDto> {
    try {
      const user: UserDto = await this.clientProxy
        .send('find_by_email', body.email)
        .toPromise();

      if (!user) {
        throw new NotFoundException('Could not found the user.');
      }

      const randomString = randomBytes(32).toString('hex');
      const token = await hash(randomString, 10);
      const expiration = process.env.RESET_PASSWORD_EXPIRATION;
      const userId = user.id;
      const resetPasswordInfo = { token, expiration, userId };

      const resetPassword =
        this.resetPasswordRepository.create(resetPasswordInfo);

      await this.resetPasswordRepository.save(resetPassword);

      return {
        message:
          'Further information has been sent to your email, please check there.',
      };
    } catch (error) {
      throw error;
    }
  }
}
