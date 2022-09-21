import { Expose, Exclude } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  password: string;

  @Expose()
  phone: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
