import { Controller, Get, Delete, Post, Body, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetAllDto } from './dtos/get-all.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user-dto';
import { Serializer } from './interceptors/serialize.interceptor';
import { DeleteAccountDto } from './dtos/delete-account.dto';
import { JwtAuthGuard } from './guards/jwt-guard';

@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  whoAmI(): string {
    return this.appService.whoAmI();
  }

  @Delete('delete-account')
  @UseGuards(JwtAuthGuard)
  @Serializer(UserDto)
  remove(@Body() body: DeleteAccountDto): Promise<UserDto> {
    return this.appService.remove(body);
  }

  @Post('create-user')
  @UseGuards(JwtAuthGuard)
  @Serializer(UserDto)
  createUser(@Body() body: CreateUserDto): Promise<UserDto> {
    return this.appService.create(body);
  }

  @MessagePattern('create_user')
  create(@Payload() payload: CreateUserDto): Promise<UserDto> {
    return this.appService.create(payload);
  }

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

  @MessagePattern('find_users')
  findAll(@Payload() payload: GetAllDto): Promise<[UserDto[], number]> {
    return this.appService.findAll(payload);
  }
}
