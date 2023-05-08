import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, Length, IsEnum } from 'class-validator';
import { UserRoles } from 'src/types';

export class CreateUserDto {
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

  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,45}$/, {
    message: 'The password should be strong',
  })
  @ApiProperty()
  @Length(6, 45)
  password: string;

  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im, {
    message: 'Invalid phone number',
  })
  @ApiProperty()
  phone: string;

  @IsEnum(UserRoles)
  @ApiProperty({ enum: [UserRoles] })
  role: string;
}
