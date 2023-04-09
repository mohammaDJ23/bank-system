import {
  Injectable,
  NestMiddleware,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { UserService } from '../services';
import { Request } from '../types';

@Injectable()
export class CurrentUserMiddleWare implements NestMiddleware {
  constructor(private userService: UserService) {}

  async use(request: Request, Response: Response, next: NextFunction) {
    const body = request.body || {};

    if (!('email' in body))
      throw new BadRequestException(
        'No email has founded to retrieve the user.',
      );

    const user = await this.userService.findByEmail(body.email);

    if (!user) throw new NotFoundException('Cound not found the user.');

    request.currentUser = user;
    next();
  }
}
