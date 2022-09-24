import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CurrentUser } from '../types/current-user';
import { AppService } from '../app.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly appService: AppService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: CurrentUser) {
    const user = await this.appService.findById(payload.id);

    if (!user) {
      throw new NotFoundException('Could not found the user.');
    }

    return payload;
  }
}
