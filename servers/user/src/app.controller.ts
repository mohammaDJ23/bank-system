import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user-dto';
import { ValidateUserDto } from './dtos/validate-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('user_creation')
  createUser(@Payload() payload: CreateUserDto): Promise<UserDto> {
    return this.appService.createUser(payload);
  }

  @MessagePattern('validate_user')
  validateUser(@Payload() payload: ValidateUserDto): Promise<UserDto> {
    return this.appService.validateUser(payload);
  }

  @MessagePattern('find_by_id')
  findById(@Payload() id: number): Promise<UserDto> {
    return this.appService.findById(id);
  }
}
