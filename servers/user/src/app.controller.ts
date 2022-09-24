import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetAllDto } from './dtos/get-all.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user-dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create_user')
  create(@Payload() payload: CreateUserDto): Promise<UserDto> {
    return this.appService.create(payload);
  }

  @MessagePattern('update_user')
  update(@Payload() Payload: UpdateUserDto): Promise<UserDto> {
    return this.appService.update(Payload);
  }

  @MessagePattern('remove_user')
  remove(@Payload() id: number): Promise<UserDto> {
    return this.appService.remove(id);
  }

  @MessagePattern('find_user_by_id')
  findById(@Payload() id: number): Promise<UserDto> {
    return this.appService.findById(id);
  }

  @MessagePattern('find_user_by_email')
  findByEmail(@Payload() email: string): Promise<UserDto> {
    return this.appService.findByEmail(email);
  }

  @MessagePattern('find_users')
  findAll(@Payload() payload: GetAllDto): Promise<[UserDto[], number]> {
    return this.appService.findAll(payload);
  }
}
