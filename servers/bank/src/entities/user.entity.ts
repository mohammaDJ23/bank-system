import { UserRoles } from 'src/types';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { Bill } from '../entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 45 })
  firstName: string;

  @Column({ type: 'varchar', length: 45 })
  lastName: string;

  @Column({ type: 'varchar', unique: true, length: 256 })
  email: string;

  @Column({ type: 'varchar', length: 60 })
  password: string;

  @Column({ type: 'varchar', length: 12 })
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

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date;

  @OneToMany(() => Bill, (bill) => bill.user, { cascade: true })
  bills: Bill[];

  @OneToMany(() => User, (user) => user.parentUser)
  users: User[];

  @ManyToOne(() => User, (user) => user.users)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  parentUser: User;
}
