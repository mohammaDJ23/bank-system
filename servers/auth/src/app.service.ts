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
    return this.clientProxy
      .send('user_creation', body)
      .toPromise()
      .then((value: UserDto) => value)
      .catch((err) => {
        switch (err.status) {
          case 409:
            throw new ConflictException(err.message);

          default:
            throw new BadRequestException();
        }
      });
  }

  async login(body: LoginDto): Promise<TokenDto> {
    return this.clientProxy
      .send('validate_user', body)
      .toPromise()
      .then((value: UserDto) => {
        const userInfo = {
          id: value.id,
          email: value.email,
          firstName: value.firstName,
          lastName: value.lastName,
        };

        const accessToken = this.jwtService.sign(userInfo);
        const expiration = process.env.JWT_EXPIRATION;
        return { accessToken, expiration };
      })
      .catch((err) => {
        switch (err.status) {
          case 404:
            throw new NotFoundException(err.message);

          default:
            throw new BadRequestException();
        }
      });
  }

  async findById(id: number): Promise<UserDto> {
    return this.clientProxy
      .send('find_by_id', id)
      .toPromise()
      .then((value: UserDto) => value)
      .catch((err) => {
        switch (err.status) {
          case 404:
            throw new NotFoundException(err.message);

          default:
            throw new BadRequestException();
        }
      });
  }
}
