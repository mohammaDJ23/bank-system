import { Injectable, NotFoundException } from '@nestjs/common';
import { RmqContext, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWithBillInfoDto } from 'src/dtos';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { RabbitmqService } from './rabbitmq.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  findById(id: number): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.user_service_id = :id', { id })
      .getOne();
  }

  async create(payload: User, context: RmqContext): Promise<void> {
    try {
      payload = Object.assign<User, Partial<User>>(payload, {
        userServiceId: payload.id,
      });
      await this.userRepository
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
      await this.userRepository.query(
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
      const user = await this.userRepository.findOneOrFail({
        where: { userServiceId: payload.id },
        relations: ['bills'],
      });
      await this.userRepository.softRemove(user);
      this.rabbitmqService.applyAcknowledgment(context);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async getUserWithBillInfo(id: number): Promise<UserWithBillInfoDto> {
    const [response]: UserWithBillInfoDto[] = await this.userRepository.query(
      `
        SELECT
          user1.user_service_id AS id,
          user1.first_name AS "firstName",
          user1.last_name AS "lastName",
          user1.email AS email,
          user1.phone AS phone,
          user1.role AS role,
          user1.created_by AS "createdBy",
          user1.created_at AS "createdAt",
          user1.updated_at AS "updatedAt",
          user1.deleted_at AS "deletedAt",
          json_build_object('counts', COALESCE(bill.counts, 0)::TEXT, 'amounts', COALESCE(bill.amounts, 0)::TEXT) AS bill,
          json_build_object(
            'id', user2.user_service_id,
            'firstName', user2.first_name,
            'lastName', user2.last_name,
            'email', user2.email,
            'phone', user2.phone,
            'role', user2.role,
            'createdBy', user2.created_by,
            'createdAt', user2.created_at,
            'updatedAt', user2.updated_at,
            'deletedAt', user2.deleted_at
          ) AS parent
        FROM public.user AS user1
        LEFT JOIN (
          SELECT bill.user_id, COUNT(bill.user_id) AS counts, SUM(bill.amount::BIGINT) AS amounts
          FROM bill
          WHERE bill.deleted_at IS NULL
          GROUP BY bill.user_id
        ) bill ON bill.user_id = $1
        LEFT JOIN public.user AS user2 ON user2.user_service_id = user1.created_by
        WHERE user1.user_service_id = $1 AND user1.deleted_at IS NULL;
      `,
      [id],
    );

    if (!response) throw new NotFoundException('Could not found the user.');
    return response;
  }
}
