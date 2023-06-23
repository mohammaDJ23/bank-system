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
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from 'src/services';
import {
  CreateUserDto,
  UserDto,
  UpdateUserByUserDto,
  UpdateUserByOwnerDto,
  ErrorDto,
  UserQuantitiesDto,
  LastWeekDto,
  AccessTokenDto,
  UserListFiltersDto,
  DeletedUserListFiltersDto,
  DeletedUserDto,
} from 'src/dtos';
import { CurrentUser, Roles, SameUser } from 'src/decorators';
import {
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  DifferentOwnerGuard,
  JwtGuard,
  RolesGuard,
  SameUserGuard,
} from 'src/guards';
import { User } from 'src/entities';
import { UserRoles } from 'src/types';
import { ParseUserListFiltersPipe } from 'src/pipes';
import {
  LastWeekUsersSerializerInterceptor,
  UsersSerializerInterceptor,
  UserSerializerInterceptor,
  UserQuantitiesSerializerInterceptor,
  TokenizeInterceptor,
  DeletedUserSerializerInterceptor,
} from 'src/interceptors';

@UseGuards(JwtGuard)
@Controller('/api/v1/user')
@ApiTags('/api/v1/user')
export class GatewayController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRoles.OWNER)
  @UseGuards(RolesGuard)
  @UseInterceptors(UserSerializerInterceptor)
  @ApiBody({ type: CreateUserDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, type: UserDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.CONFLICT, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  create(
    @Body() body: CreateUserDto,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.userService.create(body, user);
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @SameUser(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard, SameUserGuard)
  @UseInterceptors(TokenizeInterceptor)
  @ApiBody({ type: UpdateUserByUserDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: AccessTokenDto })
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

  @Put('owner/update')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoles.OWNER)
  @UseGuards(RolesGuard, DifferentOwnerGuard)
  @UseInterceptors(TokenizeInterceptor)
  @ApiBody({ type: UpdateUserByOwnerDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: AccessTokenDto })
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
  @SameUser(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(SameUserGuard, DifferentOwnerGuard)
  @UseInterceptors(UserSerializerInterceptor)
  @ApiQuery({ name: 'id', type: 'number' })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  delete(
    @Query('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.userService.delete(id, user);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoles.OWNER, UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(UsersSerializerInterceptor)
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'take', type: 'number' })
  @ApiParam({ name: 'filters', type: UserListFiltersDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto, isArray: true })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('take', ParseIntPipe) take: number,
    @Query('filters', ParseUserListFiltersPipe) filters: UserListFiltersDto,
  ): Promise<[User[], number]> {
    return this.userService.findAll(page, take, filters);
  }

  @Get('all/deleted')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoles.OWNER)
  @UseGuards(RolesGuard)
  @UseInterceptors(UsersSerializerInterceptor)
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'take', type: 'number' })
  @ApiParam({ name: 'filters', type: DeletedUserListFiltersDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto, isArray: true })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  findAllDeleted(
    @Query('page', ParseIntPipe) page: number,
    @Query('take', ParseIntPipe) take: number,
    @Query('filters', ParseUserListFiltersPipe)
    filters: DeletedUserListFiltersDto,
  ): Promise<[User[], number]> {
    return this.userService.findAllDeleted(page, take, filters);
  }

  @Get('quantities')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoles.OWNER, UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(UserQuantitiesSerializerInterceptor)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserQuantitiesDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  getUserQuantities(): Promise<UserQuantitiesDto> {
    return this.userService.getUserQuantities();
  }

  @Get('deleted-quantities')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoles.OWNER, UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(UserQuantitiesSerializerInterceptor)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserQuantitiesDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  getDeletedUserQuantities(): Promise<UserQuantitiesDto> {
    return this.userService.getDeletedUserQuantities();
  }

  @Get('last-week')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoles.OWNER, UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(LastWeekUsersSerializerInterceptor)
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
  @SameUser(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(SameUserGuard, DifferentOwnerGuard)
  @UseInterceptors(UserSerializerInterceptor)
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Get(':id/deleted')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoles.OWNER)
  @UseGuards(RolesGuard)
  @UseInterceptors(DeletedUserSerializerInterceptor)
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: DeletedUserDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  async findDeletedOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeletedUserDto> {
    return this.userService.findDeletedOne(id);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoles.OWNER)
  @UseGuards(RolesGuard)
  @UseInterceptors(UserSerializerInterceptor)
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  restoreOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.userService.restoreOne(id, user);
  }
}
