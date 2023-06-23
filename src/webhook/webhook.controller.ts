import { Controller, Post, Body, Res, Headers } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async handleWebhook(
    @Body() payload: any,
    @Res() res: any,
    @Headers() headers: any,
  ) {
    try {
      const result = await this.webhookService.processWebhook(
        payload,
        res,
        headers,
      );
      return res
        .status(result.status)
        .json({ message: result.message, data: result.data });
    } catch (e) {
      return e;
    }
  }
}
