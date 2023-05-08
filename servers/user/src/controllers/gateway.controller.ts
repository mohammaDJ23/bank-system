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
import { UserService } from '../services';
import {
  CreateUserDto,
  FindAllDto,
  UserDto,
  DeleteAccountDto,
  UpdateUserByUserDto,
  UpdateUserByOwnerDto,
  ErrorDto,
  UserQuantitiesDto,
  LastWeekDto,
} from '../dtos';
import {
  ListSerializer,
  ObjectSerializer,
  CurrentUser,
  ArraySerializer,
} from '../decorators';
import {
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import {
  IsSameUserAuthGuard,
  JwtAuthGuard,
  OwnerAuthGuard,
  OwnerOrAdminAuthGuard,
} from '../guards';
import { User } from 'src/entities';

@UseGuards(JwtAuthGuard)
@Controller('user')
@ApiTags('user')
export class GatewayController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(OwnerAuthGuard)
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
  @UseGuards(IsSameUserAuthGuard)
  @ObjectSerializer(UserDto)
  @ApiBody({ type: UpdateUserByUserDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.CONFLICT, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  update(
    @Body() body: UpdateUserByUserDto,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.userService.updateByUser(body, user);
  }

  @Put('update/owner')
  @HttpCode(HttpStatus.OK)
  @UseGuards(OwnerAuthGuard)
  @ObjectSerializer(UserDto)
  @ApiBody({ type: UpdateUserByOwnerDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.CONFLICT, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  updateByOwner(
    @Body() body: UpdateUserByOwnerDto,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.userService.updateByOwner(body, user);
  }

  @Delete('delete')
  @HttpCode(HttpStatus.OK)
  @UseGuards(IsSameUserAuthGuard)
  @ObjectSerializer(UserDto)
  @ApiBody({ type: DeleteAccountDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  delete(@Body() body: DeleteAccountDto): Promise<User> {
    return this.userService.delete(body);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(OwnerOrAdminAuthGuard)
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
  @UseGuards(OwnerOrAdminAuthGuard)
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
  @UseGuards(OwnerOrAdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ArraySerializer(LastWeekDto)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: LastWeekDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  getLastWeekUsers(): Promise<LastWeekDto[]> {
    return this.userService.lastWeekUsers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(IsSameUserAuthGuard)
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
