import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class ResetPassword {
  @PrimaryColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  token: string;

  @Column()
  expiration: Date;
}
