import { Controller, Get } from '@nestjs/common';
import { KafkaConsumerService } from './kafka.service';

@Controller('kafka')
export class KafkaController {
  constructor(private readonly kafkaService: KafkaConsumerService) {}

  @Get('')
  kafka(): Promise<any> {
    return this.kafkaService.consumeNewOrderFromKafka();
  }
}
