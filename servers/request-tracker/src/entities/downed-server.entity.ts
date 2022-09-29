import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DownedServer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  deadTime: Date;
}
