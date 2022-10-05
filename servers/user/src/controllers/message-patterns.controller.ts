import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from 'src/entities/user.entity';

@Controller()
export class MessagePatternController {
  constructor(private readonly appService: UserService) {}

  @MessagePattern('update_user')
  update(@Payload() Payload: UpdateUserDto): Promise<User> {
    return this.appService.update(Payload);
  }

  @MessagePattern('find_user_by_id')
  findById(@Payload() id: number): Promise<User> {
    return this.appService.findById(id);
  }

  @MessagePattern('find_user_by_email')
  findByEmail(@Payload() email: string): Promise<User> {
    return this.appService.findByEmail(email);
  }
}
