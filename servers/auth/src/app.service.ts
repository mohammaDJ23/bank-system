import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dtos/login.dto';
import { MessageDto } from './dtos/message.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { SignupDto } from './dtos/signup.dto';
import { TokenDto } from './dtos/token.dto';
import { UserDto } from './dtos/user.dto';
import { excpetion } from './libs/exception';
import { User } from './types/user';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly clientProxy: ClientProxy,
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

  async resetPassword(body: ResetPasswordDto): Promise<MessageDto> {
    return Promise.resolve({ message: 'done!' });
  }
}
