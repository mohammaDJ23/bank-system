import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, Length, IsNumber } from 'class-validator';

export class UpdateUserByUserDto {
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsString()
  @Length(3, 45)
  @ApiProperty()
  firstName: string;

  @IsString()
  @Length(3, 45)
  @ApiProperty()
  lastName: string;

  @Matches(
    /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/,
    {
      message: 'Invalid email',
    },
  )
  @ApiProperty()
  email: string;

  @Matches(/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
    message: 'Invalid phone number',
  })
  @ApiProperty()
  phone: string;
}
