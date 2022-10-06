import { Request as Req } from 'express';
import { User } from 'src/entities/user.entity';

export interface Request extends Req {
  currentUser: User;
}
