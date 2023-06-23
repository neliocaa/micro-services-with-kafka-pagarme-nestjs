import { Module } from '@nestjs/common';
import { PagarmeService } from './pagarme.service';
import { PagarmeController } from './pagarme.controller';

@Module({
  providers: [PagarmeService],
  exports: [PagarmeService],
  controllers: [PagarmeController],
})
export class PagarmeModule {}
