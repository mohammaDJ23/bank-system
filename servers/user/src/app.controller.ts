import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Serializer } from './interceptors/serialize.interceptor';
import { AppService } from './app.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user-dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('user_creation')
  @Serializer(UserDto)
  createUser(@Payload() payload: CreateUserDto): Promise<CreateUserDto> {
    return this.appService.createUser(payload);
  }
}
