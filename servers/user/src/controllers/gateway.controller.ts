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
  Query,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { FindAllDto } from '../dtos/find-all.dto';
import { UserDto } from '../dtos/user.dto';
import {
  ListSerializer,
  ObjectSerializer,
} from '../decorators/serializer.decorator';
import {
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { DeleteAccountDto } from '../dtos/delete-account.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { UpdateUserByUserDto } from '../dtos/update-user-by-user.dto';
import { UpdateUserByAdminDto } from '../dtos/update-user-by-admin.dto';
import { User } from 'src/entities/user.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ErrorDto } from 'src/dtos/error.dto';
import { UserQuantitiesDto } from 'src/dtos/user-quantities.dto';
import { LastWeekDto } from 'src/dtos/last-week.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
@ApiTags('user')
export class GatewayController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AdminAuthGuard)
  @ObjectSerializer(UserDto)
  @ApiBody({ type: CreateUserDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, type: UserDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.CONFLICT, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  create(@Body() body: CreateUserDto): Promise<User> {
    return this.userService.create(body);
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(UserDto)
  @ApiBody({ type: UpdateUserByUserDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.CONFLICT, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  updateByUser(
    @Body() body: UpdateUserByUserDto,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.userService.updateByUser(body, user);
  }

  @Put('update/admin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminAuthGuard)
  @ObjectSerializer(UserDto)
  @ApiBody({ type: UpdateUserByAdminDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.CONFLICT, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  updateByAdmin(@Body() body: UpdateUserByAdminDto): Promise<User> {
    return this.userService.findAndUpdate(body);
  }

  @Delete('delete')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminAuthGuard)
  @ObjectSerializer(UserDto)
  @ApiBody({ type: DeleteAccountDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  remove(@Body() body: DeleteAccountDto): Promise<User> {
    return this.userService.remove(body);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminAuthGuard)
  @ListSerializer(UserDto)
  @ApiBody({ type: FindAllDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto, isArray: true })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  findAll(
    @Query('page') page: number,
    @Query('take') take: number,
  ): Promise<[User[], number]> {
    return this.userService.findAll(page, take);
  }

  @Get('quantities')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(UserQuantitiesDto)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserQuantitiesDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  getUserQuantities(): Promise<UserQuantitiesDto> {
    return this.userService.getUserQuantities();
  }

  @Get('last-week')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(LastWeekDto)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: LastWeekDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  getLastWeekUsers(): Promise<LastWeekDto> {
    return this.userService.lastWeekUsers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(UserDto)
  @ApiParam({ name: 'id', type: Number })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(id);
  }
}
