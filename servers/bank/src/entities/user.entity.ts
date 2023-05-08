import { UserRoles } from 'src/types';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Bill } from '../entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  firstName: string;

  @Column({ length: 45 })
  lastName: string;

  @Column({ unique: true, length: 256 })
  email: string;

  @Column({ length: 60 })
  password: string;

  @Column({ length: 12 })
  phone: string;

  @Column({ unique: true })
  userServiceId: number;

  @Column({
    type: 'enum',
    enum: UserRoles,
  })
  role: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Bill, (bill) => bill.user, { cascade: true })
  bills: Bill[];
}
