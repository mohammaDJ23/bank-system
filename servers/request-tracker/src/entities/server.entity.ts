import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Server {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  deadTime: Date;

  @Column({ nullable: true })
  livedTime: Date;
}
