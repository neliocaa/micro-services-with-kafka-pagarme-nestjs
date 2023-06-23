import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Timestamp,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'kafka_new_order' })
export class NewOrderEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column()
  topic: string;

  @Column()
  order_id: string;

  @Column()
  offset: string;

  @Column({
    default: 1,
  })
  partition: number;

  @Column({
    default: 0,
  })
  attempts: number;

  @Column()
  key: string;

  @Column({
    length: 65535,
  })
  value: string;

  @Column({
    default: 'pending',
  })
  status: string;

  // altera o nome da coluna no banco de dados
  @Column({
    nullable: true,
  })
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;
}
