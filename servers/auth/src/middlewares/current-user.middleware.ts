import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { UserService } from '../services/user.service';
import { Request } from '../types/overwrites';

@Injectable()
export class CurrentUserMiddleWare implements NestMiddleware {
  constructor(private userService: UserService) {}

  async use(request: Request, Response: Response, next: NextFunction) {
    const body = request.body || {};
    const user = await this.userService.findByEmail(body?.email);

    if (!user) throw new NotFoundException('Cound not found the user.');

    request.currentUser = user;
    next();
  }
}
