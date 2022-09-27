import {
  Controller,
  Get,
  Delete,
  Post,
  Put,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AppService } from '../app.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { GetAllDto } from '../dtos/get-all.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserDto } from '../dtos/user-dto';
import { Serializer } from '../interceptors/serialize.interceptor';
import { DeleteAccountDto } from '../dtos/delete-account.dto';
import { JwtAuthGuard } from '../guards/jwt-guard';

@Controller('user')
export class GatewayController {
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
  create(@Body() body: CreateUserDto): Promise<UserDto> {
    return this.appService.create(body);
  }

  @Put('update-user')
  @UseGuards(JwtAuthGuard)
  @Serializer(UserDto)
  update(@Body() body: UpdateUserDto): Promise<UserDto> {
    return this.appService.update(body);
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  @Serializer(UserDto)
  findById(@Query('id') id: string): Promise<UserDto> {
    return this.appService.findById(+id);
  }

  @Post('users')
  @UseGuards(JwtAuthGuard)
  @Serializer(UserDto)
  findAll(@Body() body: GetAllDto): Promise<[UserDto[], number]> {
    return this.appService.findAll(body);
  }
}
