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

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly clientProxy: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

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

  async validateUser(email: string, password: string): Promise<UserDto> {
    return this.clientProxy
      .send('validate_user', { email, password })
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

  login(user: LoginDto): TokenDto {
    const accessToken = this.jwtService.sign(user);
    const expiration = process.env.JWT_EXPIRATION;
    return { accessToken, expiration };
  }
}
