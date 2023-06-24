import { IsString, Matches, Length, IsNumber, IsEnum } from 'class-validator';
import { UserRoles } from 'src/types';

export class UpdateUserDto {
  @IsNumber()
  id: number;

  @IsString()
  @Length(3, 45)
  firstName: string;

  @IsString()
  @Length(3, 45)
  lastName: string;

  @Matches(
    /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/,
    {
      message: 'Invalid email',
    },
  )
  email: string;

  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,45}$/, {
    message: 'The password should be strong',
  })
  @Length(6, 45)
  password: string;

  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im, {
    message: 'Invalid phone number',
  })
  phone: string;

  @IsEnum(UserRoles)
  role: string;
}
