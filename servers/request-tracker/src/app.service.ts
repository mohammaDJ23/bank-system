import { Injectable } from '@nestjs/common';
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

  downdServer(payload: DowndServerDto): Promise<void> {
    return new Promise((resolve) => resolve());
  }
}
