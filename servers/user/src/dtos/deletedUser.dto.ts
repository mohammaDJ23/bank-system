import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserDto } from './user.dto';

export class DeletedUserDto extends UserDto {
  @Expose()
  @ApiProperty()
  parent: UserDto;
}
