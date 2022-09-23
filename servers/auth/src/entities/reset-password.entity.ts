import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ResetPassword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ unique: true })
  token: string;

  @Column()
  expiration: number;
}
