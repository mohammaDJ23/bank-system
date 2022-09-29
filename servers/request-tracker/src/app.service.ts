import { Injectable } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DowndServerDto } from './dtos/downed-server.dto';
import { LivedServerDto } from './dtos/lived-server.dto';
import { SaveRequestedDataDto } from './dtos/save-requested-data.dto';
import { RequestedData } from './entities/requested-data.dto';
import { Server } from './entities/server.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Server)
    private readonly serverRepository: Repository<Server>,
    @InjectRepository(RequestedData)
    private readonly requestedDataRepository: Repository<RequestedData>,
  ) {}

  private async getServer(name: string): Promise<Server | {}> {
    return (
      (await this.serverRepository
        .createQueryBuilder('server')
        .where('server.name = :name', { name })
        .getOne()) || {}
    );
  }

  private rabbitmqAcknowledgement(context: RmqContext) {
    const channel = context.getChannelRef();
    const originMsg = context.getMessage();
    channel.ack(originMsg);
  }

  async downdServer(
    payload: DowndServerDto,
    context: RmqContext,
  ): Promise<void> {
    try {
      let server = await this.getServer(payload.name);
      payload.deadTime = new Date(payload.deadTime);
      server = Object.assign(server, payload);
      server = this.serverRepository.create(server);
      await this.serverRepository.save(server);
    } catch (error) {
    } finally {
      this.rabbitmqAcknowledgement(context);
    }
  }

  async livedServer(
    payload: LivedServerDto,
    context: RmqContext,
  ): Promise<void> {
    try {
      let server = await this.getServer(payload.name);
      payload.livedTime = new Date(payload.livedTime);
      server = Object.assign(server, payload);
      server = this.serverRepository.create(server);
      await this.serverRepository.save(server);
    } catch (error) {
    } finally {
      this.rabbitmqAcknowledgement(context);
    }
  }

  async saveRequestedData(
    payload: SaveRequestedDataDto,
    context: RmqContext,
  ): Promise<void> {
    try {
      payload.date = new Date(payload.date);
      payload = this.requestedDataRepository.create(payload);
      await this.requestedDataRepository.save(payload);
    } catch (error) {
    } finally {
      this.rabbitmqAcknowledgement(context);
    }
  }
}
