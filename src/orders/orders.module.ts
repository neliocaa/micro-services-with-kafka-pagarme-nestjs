import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { NewOrderEntity } from './new-order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagarmeModule } from 'src/pagarme/pagarme.module';
import { PagarmeService } from 'src/pagarme/pagarme.service';
import { ScheduleModule } from '@nestjs/schedule';
import { KafkaConsumerService } from 'src/kafka/kafka.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewOrderEntity]),
    PagarmeModule,
    ScheduleModule.forRoot(),
  ],
  providers: [OrdersService, PagarmeService, KafkaConsumerService],
  exports: [OrdersService],
})
export class OrdersModule {}
