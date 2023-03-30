import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UserWithBillInfoDto extends UserDto {
  @Expose()
  @ApiProperty()
  bill: {
    counts: string;
    amounts: string;
  };
}
