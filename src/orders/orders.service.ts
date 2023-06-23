import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewOrderEntity } from './new-order.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { PagarmeService } from 'src/pagarme/pagarme.service';
import { KafkaConsumerService } from 'src/kafka/kafka.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(NewOrderEntity)
    private Orders: Repository<NewOrderEntity>,
    private pagarme: PagarmeService,
    private kafka: KafkaConsumerService,
  ) {}

  async checkCustomer(order: any): Promise<any> {
    if (order.customerId) {
      return true;
    } else {
      try {
        const customer = await this.pagarme.getCustomer(order);
        if (customer) {
          return customer;
        } else {
          throw new Error('Não foi possível criar/recuperar cliente');
        }
      } catch (error) {}
    }
  }

  @Cron('0 * * * * *')
  async checkPendingOrders(): Promise<any> {
    try {
      console.log('[orders.service:34] ', new Date());
      const pendingOrders = await this.Orders.find({
        where: { status: 'pending' },
      });

      console.log(
        '[orders.service:33] ',
        `${pendingOrders.length} pedidos pendentes`,
      );
      for await (const order of pendingOrders) {
        try {
          if (order.attempts >= +process.env.RETRY_ATTEMPTS) {
            order.status = 'canceled';
            console.log('[orders.service:49] ', order.timestamp.toISOString());
            await this.Orders.save(order);
            await this.kafka.produceToKafka({
              topic: 'pets_new_order_canceled',
              messages: [
                {
                  key: Math.round(Math.random() * 1000000).toString(),
                  value: JSON.stringify({
                    order: {
                      id: order.id,
                      status: 'canceled',
                      errors: `Pedido cancelado após ${process.env.RETRY_ATTEMPTS} tentativas de pagamento`,
                    },
                  }),
                },
              ],
            });
            // throw new Error(
            //   `Pedido cancelado após ${process.env.RETRY_ATTEMPTS} tentativas de pagamento`,
            // );
          } else if (order.attempts < +process.env.RETRY_ATTEMPTS) {
            order.attempts += 1;
            await this.Orders.save(order);
          }
          // const orderSerialized = JSON.parse(order.value);
          //if (await this.checkCustomer(orderSerialized.order)) {

          //   console.log(
          //     '[orders.service:48] ',
          //     'Criar pedido: ',
          //     order.id,
          //     ' para: ',
          //     orderSerialized.order.customer.id,
          //   );
          //}
        } catch (error) {
          console.log('[orders.service:86] ', error);
        }
      }
    } catch (error) {
      //   console.log('[orders.service:50] ', error);
    }
  }
}
