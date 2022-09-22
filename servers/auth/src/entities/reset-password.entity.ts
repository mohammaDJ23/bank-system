import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class ResetPassword {
  @PrimaryColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  token: string;

  @Column()
  expiration: Date;
}
