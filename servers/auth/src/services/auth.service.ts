import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { User } from 'src/entities';
import { OauthUser, UserSignInfoObj } from 'src/types';
import { LoginDto, OauthTokenDto, TokenDto } from '../dtos';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  getUserSignInfo(user: User): UserSignInfoObj {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      expiration: +process.env.JWT_EXPIRATION,
    };
  }

  getJwtToken(user: User): TokenDto {
    const userInfo = this.getUserSignInfo(user);
    const accessToken = this.jwtService.sign(userInfo);
    return { accessToken };
  }

  async login(body: LoginDto, currentUser: User): Promise<TokenDto> {
    const isPasswordsEqual = await compare(body.password, currentUser.password);

    if (!isPasswordsEqual)
      throw new NotFoundException(`Could not found the user.`);

    return this.getJwtToken(currentUser);
  }

  async loginWithOauth(user: OauthUser): Promise<OauthTokenDto> {
    const findedUser = await this.userService.findByEmail(user.email);

    if (!findedUser)
      throw new BadRequestException(
        'The user does not exist in our database for the creattion of an account for you try to contact to the owner then try to login with local authentication or google service.',
      );

    const jwtToken = this.getJwtToken(findedUser);

    return {
      accessToken: jwtToken.accessToken,
      oauthAccessToken: user.accessToken,
    };
  }
}
