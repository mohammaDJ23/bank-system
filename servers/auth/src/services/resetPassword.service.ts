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
import { UserService } from './user.service';
import { MessageDto, ForgotPasswordDto, ResetPasswordDto } from 'src/dtos';
import { User, ResetPassword } from 'src/entities';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  private findResetPasswordByToken(token: string): Promise<ResetPassword> {
    return this.resetPasswordRepository
      .createQueryBuilder('reset_password')
      .where('reset_password.token = :token', { token })
      .getOne();
  }

  async forgotPassword(
    body: ForgotPasswordDto,
    currentUser: User,
  ): Promise<MessageDto> {
    const randomString = randomBytes(32).toString('hex');
    const token = await hash(randomString, 10);
    const expiration = new Date(
      new Date().getTime() + +process.env.RESET_PASSWORD_EXPIRATION,
    );

    await this.resetPasswordRepository
      .createQueryBuilder()
      .insert()
      .into(ResetPassword)
      .values({ token, expiration, userId: currentUser.id })
      .execute();

    const mailerOptions = {
      from: process.env.MAILER_USER,
      to: currentUser.email,
      subject: 'Reset password link',
      template: './resetPassword',
      context: {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        link: `${process.env.CLIENT_CONTAINER_URL}/auth/reset-password?token=${token}`,
      },
    };

    await this.mailerService.sendMail(mailerOptions);

    return {
      message:
        'Further information has been sent to your email, please check there.',
    };
  }

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

    const hashedPassword = await hash(body.password, 10);
    const user = await this.userService.updatePartial({
      id: resetPassword.userId,
      password: hashedPassword,
    });

    const mailerOptions = {
      from: process.env.MAILER_USER,
      to: user.email,
      subject: 'Changed password',
      template: './changedPassword',
      context: {
        firstName: user.firstName,
        link: `${process.env.CLIENT_CONTAINER_URL}/auth/login`,
      },
    };
    await this.mailerService.sendMail(mailerOptions);

    return { message: 'Your password has been changed.' };
  }

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
