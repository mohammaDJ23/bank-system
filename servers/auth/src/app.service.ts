import { Injectable } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';

@Injectable()
export class AppService {
  async signup(body: SignupDto) {
    return body;
  }
}
