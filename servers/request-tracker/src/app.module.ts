import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronJobsController } from './cron-jobs.controller';
import { RequestedData } from './entities/requested-data.dto';
import { Server } from './entities/server.entity';
import { MessagePatternsController } from './message-patterns.controller';
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
        entities: [Server, RequestedData],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Server, RequestedData]),
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, MessagePatternsController, CronJobsController],
  providers: [AppService],
})
export class AppModule {}
