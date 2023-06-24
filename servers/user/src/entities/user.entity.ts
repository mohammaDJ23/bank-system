import { UserRoles } from 'src/types';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';

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

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.USER,
  })
  role: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date;

  @OneToMany(() => User, (user) => user.parent)
  users: User[];

  @ManyToOne(() => User, (user) => user.users)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  parent: User;
}
