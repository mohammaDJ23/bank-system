import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from 'src/entities/user.entity';

@Controller()
export class MessagePatternController {
  constructor(private readonly appService: UserService) {}

  @MessagePattern('update_user')
  update(
    @Payload() payload: Record<'updatedUser' | 'user', User>,
    @Ctx() context: RmqContext,
  ): Promise<User> {
    return this.appService.update(payload.updatedUser, payload.user, context);
  }

  @MessagePattern('find_and_update_user')
  findAndUpdate(
    @Payload() payload: UpdateUserDto,
    @Ctx() context: RmqContext,
  ): Promise<User> {
    return this.appService.findAndUpdate(payload, context);
  }

  @MessagePattern('find_user_by_id')
  findById(@Payload() id: number, @Ctx() context: RmqContext): Promise<User> {
    return this.appService.findById(id, context);
  }

  @MessagePattern('find_user_by_email')
  findByEmail(
    @Payload() email: string,
    @Ctx() context: RmqContext,
  ): Promise<User> {
    return this.appService.findByEmail(email, context);
  }
}
