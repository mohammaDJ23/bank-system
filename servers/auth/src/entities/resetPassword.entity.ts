import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ResetPassword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'varchar',unique: true })
  token: string;

  @Column({ type: 'timestamptz' })
  expiration: Date;
}
