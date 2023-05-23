import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { AccessTokenDto } from 'src/dtos';
import { User } from 'src/entities';

@Injectable()
export class TokenizeInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: User) => {
        const userInfo = {
          id: data.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          expiration: +process.env.JWT_EXPIRATION,
        };
        const accessToken = this.jwtService.sign(userInfo);

        return plainToClass(
          AccessTokenDto,
          { accessToken },
          {
            excludeExtraneousValues: true,
          },
        );
      }),
    );
  }
}
