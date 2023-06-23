import { Injectable } from '@nestjs/common';
import { Kafka, KafkaConfig } from 'kafkajs';
import { kafkaConfig } from '../configs/kafka.config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewOrderEntity } from '../orders/new-order.entity';
import { fromUnixTime } from 'date-fns';
import { OrderDto } from '../orders/dto/new-order.dto';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class KafkaConsumerService {
  private kafka: Kafka;

  constructor(
    @InjectRepository(NewOrderEntity)
    private newOrderRepository: Repository<NewOrderEntity>,
  ) {
    this.kafka = new Kafka(kafkaConfig as KafkaConfig);
  }

  async consumeNewOrderFromKafka() {
    try {
      console.log('[kafka.service:22] ', 'consumeFromKafka');
      const consumeOrder = this.kafka.consumer({ groupId: 'orders' });
      await consumeOrder.connect();
      await consumeOrder.subscribe({
        topic: 'pets_new_order',
        fromBeginning: false,
      });
      await consumeOrder.run({
        eachMessage: async ({ topic, partition, message }) => {
          // console.log('[kafka.service:31] ', {
          //   topic,
          //   partition,
          //   offset: message.offset,
          //   key: message.key.toString(),
          //   value: message.value.toString(),
          //   timestamp: fromUnixTime(+message.timestamp / 1000),
          // });
          const content = JSON.parse(message.value.toString());
          const newOrder = new NewOrderEntity();
          newOrder.topic = topic;
          newOrder.order_id = content.order.id?.toString() || '';
          newOrder.partition = partition;
          newOrder.offset = message.offset;
          newOrder.key = message.key.toString();
          newOrder.value = message.value.toString();
          newOrder.timestamp = fromUnixTime(+message.timestamp / 1000);

          const checkIfExist = await this.newOrderRepository.findOne({
            where: { order_id: newOrder.order_id },
          });

          if (checkIfExist) {
            console.log('[kafka.service:56] ', 'checkIfExist');
            return;
          } else {
            const verifiedOrder = plainToClass(
              OrderDto,
              JSON.parse(newOrder.value).order,
            );
            const errors: ValidationError[] = await validate(verifiedOrder);
            if (errors.length > 0) {
              const allErrors = getAllErrors(errors);
              console.log('[kafka.service:63] errors: ', allErrors);
              await this.produceToKafka({
                topic: 'pets_new_order_error',
                messages: [
                  {
                    key: Math.round(Math.random() * 1000000).toString(),
                    value: JSON.stringify({
                      order: {
                        id: verifiedOrder.id,
                        status: 'error',
                        errors: allErrors,
                      },
                    }),
                  },
                ],
              });

              return;
            } else {
              await this.newOrderRepository.save(newOrder);
            }
          }
          function getAllErrors(errors: ValidationError[]): any {
            const allErrors = {};
            errors.forEach((error: ValidationError) => {
              if (error.children && error.children.length > 0) {
                allErrors[error.property] = getAllErrors(error.children);
              } else {
                allErrors[error.property] = Object.values(error.constraints);
              }
            });
            return allErrors;
          }
          // console.log(
          //   '[kafka.service:48] ',
          //   JSON.parse(message.value.toString()),
          // );
        },
      });
    } catch (err) {
      console.log('[kafka.service:82] ', err);
    }
  }

  async produceToKafka(payload: any) {
    try {
      const producer = this.kafka.producer();
      await producer.connect();
      await producer
        .send({
          topic: payload.topic,
          messages: payload.messages,
        })
        .catch((err) => {
          console.log('[kafka.service:96] ', err);
        });
      //await producer.disconnect();
    } catch (err) {
      console.log('[kafka.service:99] ', err);
    }
  }
}
