import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../services/user.service';
import { User } from '../entities';
import { CustomNamingStrategy } from '../strategies/naming.strategy';
import { AllExceptionFilter } from '../filters/catch.filter';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { GatewayController, MessagePatternController } from '../controllers';
import { RabbitMqQueue, RabbitMqServices } from '../types/rabbitmq';
import { RabbitmqService } from 'src/services/rabbitmq.service';
import { UserConnectionGateWay } from 'src/gateways';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: RabbitMqServices.USER,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: RabbitMqQueue.REQUEST_TRACKER,
          queueOptions: {
            durable: true,
          },
          noAck: false,
        },
      },
      {
        name: RabbitMqServices.USER,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: RabbitMqQueue.BANK,
          queueOptions: {
            durable: true,
          },
          noAck: false,
        },
      },
    ]),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        namingStrategy: new CustomNamingStrategy(),
        entities: [User],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([User]),
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
  controllers: [GatewayController, MessagePatternController],
  providers: [
    UserService,
    JwtStrategy,
    RabbitmqService,
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    UserConnectionGateWay,
  ],
})
export class AppModule {}
