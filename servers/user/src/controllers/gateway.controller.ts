import {
  Controller,
  Get,
  Delete,
  Post,
  Put,
  Body,
  UseGuards,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { FindAllDto } from '../dtos/find-all.dto';
import { UserDto } from '../dtos/user-dto';
import { Serializer } from '../decorators/serializer.decorator';
import { DeleteAccountDto } from '../dtos/delete-account.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { UpdateUserByUserDto } from '../dtos/update-user-by-user.dto';
import { UpdateUserByAdminDto } from '../dtos/update-user-by-admin.dto';
import { User } from 'src/entities/user.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Serializer(UserDto)
@Controller('user')
export class GatewayController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AdminAuthGuard)
  create(@Body() body: CreateUserDto): Promise<User> {
    return this.userService.create(body);
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  updateByUser(
    @Body() body: UpdateUserByUserDto,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.userService.updateByUser(body, user);
  }

  @Put('update/admin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminAuthGuard)
  updateByAdmin(@Body() body: UpdateUserByAdminDto): Promise<User> {
    return this.userService.updateByAdmin(body);
  }

  @Delete('delete')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminAuthGuard)
  remove(@Body() body: DeleteAccountDto): Promise<User> {
    return this.userService.remove(body);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminAuthGuard)
  findAll(@Body() body: FindAllDto): Promise<[User[], number]> {
    return this.userService.findAll(body);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(id);
  }
}
