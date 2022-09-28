import { IsString, Matches, Length, IsNumber, IsEnum } from 'class-validator';
import { Roles } from 'src/types/user';

export class UpdateUserByAdminDto {
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

  @Matches(/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
    message: 'Invalid phone number',
  })
  phone: string;

  @IsEnum(Roles)
  role: string;
}
