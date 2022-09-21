import { Expose } from 'class-transformer';

export class validatedUserDto {
  @Expose()
  email: string;

  @Expose()
  password: string;
}
