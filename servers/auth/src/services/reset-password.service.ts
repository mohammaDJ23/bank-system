import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { ResetPassword } from 'src/entities/reset-password.entity';
import { UserService } from './user.service';
import { MessageDto } from 'src/dtos/message.dto';
import { ForgotPasswordDto } from 'src/dtos/forgot-password.dto';
import { ResetPasswordDto } from 'src/dtos/reset-password.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  // finding the reset password information by a token

  private findResetPasswordByToken(token: string): Promise<ResetPassword> {
    return this.resetPasswordRepository
      .createQueryBuilder('reset_password')
      .where('reset_password.token = :token', { token })
      .getOne();
  }

  // at first the user needs a token for changing the password

  async forgotPassword(
    body: ForgotPasswordDto,
    currentUser: User,
  ): Promise<MessageDto> {
    const randomString = randomBytes(32).toString('hex');
    const token = await hash(randomString, 10);

    const expiration = new Date(
      new Date().getTime() + +process.env.RESET_PASSWORD_EXPIRATION,
    );

    const resetPasswordInfo = { token, expiration, userId: currentUser.id };

    const resetPassword =
      this.resetPasswordRepository.create(resetPasswordInfo);

    await this.resetPasswordRepository.save(resetPassword);

    const mailerOptions = {
      from: process.env.MAILER_USER,
      to: currentUser.email,
      subject: 'Reset password link',
      template: './reset-password',
      context: {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        link: `${process.env.CLIENT_URL}/auth/reset-password?token=${token}`,
      },
    };

    await this.mailerService.sendMail(mailerOptions);

    return {
      message:
        'Further information has been sent to your email, please check there.',
    };
  }

  // the reset password logic after a user has a token then the user can change the password

  async resetPassword(body: ResetPasswordDto): Promise<MessageDto> {
    const actualPassword = body.password.toString().toLowerCase();
    const confirmedPassword = body.confirmedPassword.toString().toLowerCase();

    if (actualPassword !== confirmedPassword)
      throw new BadRequestException('The passwords are not equal.');

    const resetPassword = await this.findResetPasswordByToken(body.token);

    if (!resetPassword) throw new NotFoundException('Provided invalid token.');

    const isTokenExpired = new Date() > new Date(resetPassword.expiration);

    if (isTokenExpired)
      throw new BadRequestException('The token used has been expired.');

    const user = await this.userService.findById(resetPassword.userId);
    user.password = await hash(body.password, 10);
    await this.userService.update(user);
    await this.resetPasswordRepository.remove(resetPassword);

    const mailerOptions = {
      from: process.env.MAILER_USER,
      to: user.email,
      subject: 'Changed password',
      template: './changed-password',
      context: {
        firstName: user.firstName,
        link: `${process.env.CLIENT_URL}/auth/login`,
      },
    };

    await this.mailerService.sendMail(mailerOptions);

    return { message: 'Your password has been changed.' };
  }

  // cleaning up the generated token in the forgot password step in the database

  async removeResetPasswordTokens() {
    try {
      await this.resetPasswordRepository
        .createQueryBuilder('reset_password')
        .delete()
        .where('reset_password.expiration < :now', { now: new Date() })
        .execute();
    } catch (error) {}
  }
}
