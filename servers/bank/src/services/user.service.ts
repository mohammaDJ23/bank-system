import { Injectable, NotFoundException } from '@nestjs/common';
import { RmqContext, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWithBillInfoDto } from 'src/dtos';
import { UserRoles } from 'src/types';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { RabbitmqService } from './rabbitmq.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userService: Repository<User>,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  findById(id: number): Promise<User> {
    return this.userService
      .createQueryBuilder('user')
      .where('user.user_service_id = :id', { id })
      .getOne();
  }

  async create(payload: User, context: RmqContext): Promise<void> {
    try {
      payload = Object.assign<User, Partial<User>>(payload, {
        userServiceId: payload.id,
      });
      await this.userService
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(payload)
        .execute();
      this.rabbitmqService.applyAcknowledgment(context);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async update(payload: User, context: RmqContext): Promise<void> {
    try {
      await this.userService.query(
        `
          UPDATE public.user
          SET 
            email = $1,
            first_name = $2,
            last_name = $3,
            password = $4,
            phone = $5,
            role = $6,
            user_service_id = $7,
            updated_at = $8
          WHERE public.user.user_service_id = $7;
        `,
        [
          payload.email,
          payload.firstName,
          payload.lastName,
          payload.password,
          payload.phone,
          payload.role,
          payload.id,
          payload.updatedAt,
        ],
      );
      this.rabbitmqService.applyAcknowledgment(context);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async delete(payload: User, context: RmqContext): Promise<void> {
    try {
      await this.userService
        .createQueryBuilder('public.user')
        .delete()
        .where('public.user.user_service_id = :userId')
        .setParameters({ userId: payload.id })
        .execute();
      this.rabbitmqService.applyAcknowledgment(context);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async getUserWithBillInfo(
    id: number,
    user: User,
  ): Promise<UserWithBillInfoDto> {
    if (user.role === UserRoles.USER && user.userServiceId !== id)
      throw new NotFoundException('Could not found the user.');

    const [response]: UserWithBillInfoDto[] = await this.userService.query(
      `
        SELECT 
          public.user.user_service_id AS id,
          public.user.first_name AS "firstName",
          public.user.last_name AS "lastName",
          public.user.email AS email,
          public.user.phone AS phone,
          public.user.role AS role,
          public.user.created_at AS "createdAt",
          public.user.updated_at AS "updatedAt",
          json_build_object('counts', COALESCE(bill.counts, 0)::TEXT, 'amounts', COALESCE(bill.amounts, 0)::TEXT) AS bill
        FROM public.user
        LEFT JOIN (
          SELECT bill.user_id, COUNT(bill.user_id) AS counts, SUM(bill.amount::BIGINT) AS amounts
          FROM bill
          GROUP BY bill.user_id
        ) bill ON bill.user_id = $1
        WHERE public.user.user_service_id = $1;
      `,
      [id],
    );

    if (!response) throw new NotFoundException('Could not found the user.');
    return response;
  }
}
