import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RequestedData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serverName: string;

  @Column()
  message: string;

  @Column()
  date: Date;

  @Column('jsonb')
  data: Object;
}
