import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user-dto';

@Controller()
export class MessagePatternController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('update_user')
  update(@Payload() Payload: UpdateUserDto): Promise<UserDto> {
    return this.appService.update(Payload);
  }

  @MessagePattern('find_user_by_id')
  findById(@Payload() id: number): Promise<UserDto> {
    return this.appService.findById(id);
  }

  @MessagePattern('find_user_by_email')
  findByEmail(@Payload() email: string): Promise<UserDto> {
    return this.appService.findByEmail(email);
  }
}