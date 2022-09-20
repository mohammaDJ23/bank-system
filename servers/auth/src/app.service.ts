import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignupDto } from './dtos/signup.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly clientProxy: ClientProxy,
  ) {}

  async signup(body: SignupDto) {
    return this.clientProxy.send('user_creation', body).toPromise();
  }
}
