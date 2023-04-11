import { Request as Req } from 'express';
import { User } from 'src/entities';

export interface Request extends Req {
  currentUser: User;
}
