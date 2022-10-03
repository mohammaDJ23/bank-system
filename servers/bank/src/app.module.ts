import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE, APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Bill } from './entities/bill.entity';
import { User } from './entities/user.entity';
import { AllExceptionFilter } from './filters/catch.filter';
import { GatewayController } from './gateway.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CustomNamingStrategy } from './strategies/naming.strategy';

@Module({
  imports: [
    ClientsModule.register([]),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        namingStrategy: new CustomNamingStrategy(),
        entities: [Bill, User],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Bill, User]),
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
  ],
  controllers: [AppController, GatewayController],
  providers: [
    AppService,
    JwtStrategy,
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        validateCustomDecorators: true,
      }),
    },
  ],
})
export class AppModule {}
