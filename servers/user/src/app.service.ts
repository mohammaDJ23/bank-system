import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class AppService {
  createUser(payload: CreateUserDto): Promise<CreateUserDto> {
    console.log(payload);
    return new Promise((resolve) => resolve(payload));
  }
}
