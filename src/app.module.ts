import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhookService } from './webhook/webhook.service';
import { WebhookController } from './webhook/webhook.controller';
import { KafkaModule } from './kafka/kafka.module';
import { KafkaConsumerService } from './kafka/kafka.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewOrderEntity } from './orders/new-order.entity';
import { typeOrmConfig } from './configs/typeorm.config';
import { OrdersModule } from './orders/orders.module';
import { PagarmeModule } from './pagarme/pagarme.module';
import { OrdersService } from './orders/orders.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    KafkaModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([NewOrderEntity]),
    OrdersModule,
    PagarmeModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController, WebhookController],
  providers: [AppService, WebhookService, KafkaConsumerService],
})
export class AppModule {
  constructor(
    private readonly kafkaConsumerService: KafkaConsumerService,
    private readonly ordersService: OrdersService,
  ) {
    this.kafkaConsumerService.consumeNewOrderFromKafka();
    this.ordersService.checkPendingOrders();
  }
}
