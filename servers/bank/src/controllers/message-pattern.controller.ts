import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { User } from '../entities/user.entity';
import { UserService } from 'src/services/user.service';

@Controller()
export class MessagePatternController {
  constructor(private readonly userService: UserService) {}

  @EventPattern('created_user')
  createUser(@Payload() payload: User): void {
    this.userService.create(payload);
  }

  @EventPattern('updated_user')
  updateUser(@Payload() payload: User): void {
    this.userService.update(payload);
  }

  @EventPattern('removed_user')
  removeUser(@Payload() payload: User): void {
    this.userService.remove(payload);
  }
}
