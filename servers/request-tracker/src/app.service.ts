import { Injectable } from '@nestjs/common';
import { Ctx, RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DowndServerDto } from './dtos/downed-server.dto';
import { DownedServer } from './entities/downed-server.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(DownedServer)
    private readonly downedServerRepository: Repository<DownedServer>,
  ) {}

  async downdServer(
    payload: DowndServerDto,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    try {
      payload = Object.assign<DowndServerDto, Partial<DowndServerDto>>(
        payload,
        { deadTime: new Date(payload.deadTime) },
      );

      payload = this.downedServerRepository.create(payload);
      await this.downedServerRepository.save(payload);
    } catch (error) {
    } finally {
      const channel = context.getChannelRef();
      const originMsg = context.getMessage();
      channel.ack(originMsg);
    }
  }
}
