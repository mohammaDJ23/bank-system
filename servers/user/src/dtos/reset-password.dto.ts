import { IsNumber, Length, Matches } from 'class-validator';

export class ResetPasswordDto {
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,45}$/, {
    message: 'The password should be strong',
  })
  @Length(6, 45)
  password: string;

  @IsNumber()
  userId: number;
}
