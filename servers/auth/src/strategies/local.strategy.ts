import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AppService } from '../app.service';
import { validatedUserDto } from 'src/dtos/validated-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly appService: AppService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<validatedUserDto> {
    const user = await this.appService.validateUser(email, password);
    return { email: user.email, password: user.password };
  }
}
