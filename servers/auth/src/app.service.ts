import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignupDto } from './dtos/signup.dto';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly clientProxy: ClientProxy,
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
            throw new BadRequestException(err.message);
        }
      });
  }
}
