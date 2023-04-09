import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { LoginDto, TokenDto } from '../dtos';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(body: LoginDto, currentUser: User): Promise<TokenDto> {
    const isPasswordsEqual = await compare(body.password, currentUser.password);

    if (!isPasswordsEqual)
      throw new NotFoundException(`Could not found the user.`);

    const userInfo = {
      id: currentUser.id,
      email: currentUser.email,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      role: currentUser.role,
      expiration: +process.env.JWT_EXPIRATION,
    };

    const accessToken = this.jwtService.sign(userInfo);
    return { accessToken };
  }
}
