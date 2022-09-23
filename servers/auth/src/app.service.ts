import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { LoginDto } from './dtos/login.dto';
import { MessageDto } from './dtos/message.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { SignupDto } from './dtos/signup.dto';
import { TokenDto } from './dtos/token.dto';
import { UserDto } from './dtos/user.dto';
import { ResetPassword } from './entities/reset-password.entity';
import { excpetion } from './libs/exception';
import { User } from './types/user';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly clientProxy: ClientProxy,
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  getHello(currentUser: User): string {
    return `hello ${currentUser.firstName} ${currentUser.lastName}`;
  }

  async signup(body: SignupDto): Promise<UserDto> {
    try {
      const user: UserDto = await this.clientProxy
        .send('user_creation', body)
        .toPromise();

      return user;
    } catch (error) {
      excpetion(error);
    }
  }

  async login(body: LoginDto): Promise<TokenDto> {
    try {
      const user: UserDto = await this.clientProxy
        .send('validate_user', body)
        .toPromise();

      const userInfo = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      const accessToken = this.jwtService.sign(userInfo);
      const expiration = +process.env.JWT_EXPIRATION;
      return { accessToken, expiration };
    } catch (error) {
      excpetion(error);
    }
  }

  async findById(id: number): Promise<UserDto> {
    try {
      const user: UserDto = await this.clientProxy
        .send('find_by_id', id)
        .toPromise();

      return user;
    } catch (error) {
      excpetion(error);
    }
  }

  async forgotPassword(body: ForgotPasswordDto): Promise<MessageDto> {
    try {
      const user: UserDto = await this.clientProxy
        .send('find_by_email', body.email)
        .toPromise();

      if (!user) {
        throw new NotFoundException('Could not found the user.');
      }

      const randomString = randomBytes(32).toString('hex'),
        token = await hash(randomString, 10),
        { id: userId, email: userEmail, firstName, lastName } = user,
        expiration = new Date(
          new Date().getTime() + +process.env.RESET_PASSWORD_EXPIRATION,
        ),
        resetPasswordInfo = { token, expiration, userId },
        resetPassword = this.resetPasswordRepository.create(resetPasswordInfo),
        mailerOptions = {
          from: process.env.MAILER_USER,
          to: userEmail,
          subject: 'Reset password link',
          template: './reset-password',
          context: {
            firstName,
            lastName,
            link: `${process.env.CLIENT_URL}/reset-password?token=${token}`,
          },
        };

      await this.resetPasswordRepository.save(resetPassword);
      await this.mailerService.sendMail(mailerOptions);

      return {
        message:
          'Further information has been sent to your email, please check there.',
      };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(body: ResetPasswordDto): Promise<MessageDto> {
    try {
      const actualPassword = body.password.toString().toLowerCase(),
        confirmedPassword = body.confirmedPassword.toString().toLowerCase();

      if (actualPassword !== confirmedPassword)
        throw new BadRequestException('The passwords are not equal.');

      const resetPassword = await this.resetPasswordRepository.findOne({
        where: { token: body.token },
      });

      if (!resetPassword)
        throw new NotFoundException('Provided invalid token.');

      const isTokenExpired = new Date() > new Date(resetPassword.expiration);

      if (isTokenExpired)
        throw new BadRequestException('The token used has been expired.');

      await this.clientProxy
        .send('reset_password', {
          userId: resetPassword.userId,
          password: body.password,
        })
        .toPromise();

      await this.resetPasswordRepository.remove(resetPassword);

      return { message: 'Your password has been changed.' };
    } catch (error) {
      throw error;
    }
  }
}
