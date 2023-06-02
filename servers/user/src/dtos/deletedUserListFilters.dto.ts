import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserListFiltersDto } from './userListFilters.dto';

export class DeletedUserListFiltersDto extends UserListFiltersDto {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  deletedDate: number;
}
