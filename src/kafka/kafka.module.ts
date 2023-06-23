import { Module } from '@nestjs/common';
import { KafkaConsumerService } from './kafka.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewOrderEntity } from '../orders/new-order.entity';
import { KafkaController } from './kafka.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewOrderEntity]),
    // ClientsModule.register([
    //   {
    //     name: 'KAFKA_SERVICE',
    //     transport: Transport.KAFKA,
    //     options: {
    //       client: {
    //         brokers: ['genuine-opossum-14105-us1-kafka.upstash.io:9092'],
    //         sasl: {
    //           mechanism: 'scram-sha-256',
    //           username:
    //             'Z2VudWluZS1vcG9zc3VtLTE0MTA1JOqxvhCXHe-_UijWAnuEg2-yNah9XFsICFU',
    //           password: '8da1275acd454ef4bc43ae39e7a153f9',
    //         },
    //         ssl: true,
    //       },
    //       consumer: {
    //         groupId: 'orders',
    //       },
    //     },
    //   },
    // ]),
  ],
  controllers: [KafkaController],
  providers: [KafkaConsumerService],
})
export class KafkaModule {}
