import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ResetPassword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  token: string;

  @Column()
  expiration: string;
}
