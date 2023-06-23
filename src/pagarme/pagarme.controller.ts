import { Body, Controller, Post, Get, Delete, Param } from '@nestjs/common';
import { PagarmeService } from './pagarme.service';
import { NewCardDto } from './dto/new_card.dto';

@Controller('payments')
export class PagarmeController {
  constructor(private readonly pagarmeService: PagarmeService) {}

  @Post('cards/:customer_id?')
  async createCard(
    @Body() data: NewCardDto,
    @Param('customer_id') customer_id: string | undefined,
  ): Promise<any> {
    return await this.pagarmeService.createCard(data, customer_id);
  }

  @Get('cards/:customer_id')
  async listCard(@Param('customer_id') customer_id: string): Promise<any> {
    return await this.pagarmeService.listCard(customer_id);
  }

  @Get('cards/:customer_id/:card_id')
  async getCard(
    @Param('customer_id') customer_id: string,
    @Param('card_id') card_id: string,
  ): Promise<any> {
    return await this.pagarmeService.getCard(customer_id, card_id);
  }

  @Delete('cards/:customer_id/:card_id')
  async deleteCard(
    @Param('customer_id') customer_id: string,
    @Param('card_id') card_id: string,
  ): Promise<any> {
    return await this.pagarmeService.deleteCard(customer_id, card_id);
  }
}
