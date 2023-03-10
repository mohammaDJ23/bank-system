import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '0', length: 100 })
  amount: string;

  @Column({ length: 100 })
  receiver: string;

  @Column({ length: 500 })
  description: string;

  @Column({
    type: 'timestamptz',
    transformer: {
      from(value) {
        return new Date(value);
      },
      to(value) {
        return new Date(value);
      },
    },
  })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.bills)
  user: User;
}
