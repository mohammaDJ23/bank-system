import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dtos/login.dto';
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

  private getUser(user: UserDto) {
    return user;
  }

  private generateToken(value: UserDto): TokenDto {
    const userInfo = {
      id: value.id,
      email: value.email,
      firstName: value.firstName,
      lastName: value.lastName,
    };

    const accessToken = this.jwtService.sign(userInfo);
    const expiration = process.env.JWT_EXPIRATION;
    return { accessToken, expiration };
  }

  getHello(currentUser: User): string {
    return `hello ${currentUser.firstName} ${currentUser.lastName}`;
  }

  async signup(body: SignupDto): Promise<UserDto | void> {
    return this.clientProxy
      .send('user_creation', body)
      .toPromise()
      .then(this.getUser)
      .catch(excpetion);
  }

  async login(body: LoginDto): Promise<TokenDto | void> {
    return this.clientProxy
      .send('validate_user', body)
      .toPromise()
      .then(this.generateToken)
      .catch(excpetion);
  }

  async findById(id: number): Promise<UserDto | void> {
    return this.clientProxy
      .send('find_by_id', id)
      .toPromise()
      .then(this.getUser)
      .catch(excpetion);
  }
}
