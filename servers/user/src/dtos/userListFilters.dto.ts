import { UserRoles } from 'src/types';
import { IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UserListFiltersDto {
  @IsString()
  @ApiProperty()
  q: string;

  @IsEnum(UserRoles, { each: true })
  @ApiProperty({ enum: [UserRoles] })
  roles: UserRoles[];

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  fromDate: number;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  toDate: number;
}
