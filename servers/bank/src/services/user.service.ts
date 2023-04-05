import { Injectable, NotFoundException } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWithBillInfoDto } from 'src/dtos/user-with-bill-info.dto';
import { Roles } from 'src/types/user';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
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
      let user = Object.assign<User, Partial<User>>(payload, {
        userServiceId: payload.id,
      });
      user = this.userService.create(user);
      await this.userService.save(user);
      this.rabbitmqService.applyAcknowledgment(context);
    } catch (error) {
      throw error;
    }
  }

  async update(payload: User, context: RmqContext): Promise<void> {
    try {
      let user = await this.findById(payload.id);
      user.email = payload.email;
      user.firstName = payload.firstName;
      user.lastName = payload.lastName;
      user.password = payload.password;
      user.phone = payload.phone;
      user.role = payload.role;
      user.userServiceId = payload.id;
      user.updatedAt = payload.updatedAt;
      user.createdAt = payload.createdAt;
      user = this.userService.create(user);
      await this.userService.update(
        { userServiceId: user.userServiceId },
        user,
      );
      this.rabbitmqService.applyAcknowledgment(context);
    } catch (error) {
      throw error;
    }
  }

  async delete(payload: User, context: RmqContext): Promise<void> {
    try {
      await this.userService.delete({ userServiceId: payload.id });
      this.rabbitmqService.applyAcknowledgment(context);
    } catch (error) {
      throw error;
    }
  }

  async getUserWithBillInfo(
    id: number,
    user: User,
  ): Promise<UserWithBillInfoDto> {
    if (user.role !== Roles.ADMIN && user.userServiceId !== id)
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
