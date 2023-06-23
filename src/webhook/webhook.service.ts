import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class WebhookService {
  processWebhook(payload: any, res: any, headers: any): Promise<any> {
    try {
      const authHash = headers.authorization?.split('Basic ')[1];
      if (!authHash) {
        throw new UnauthorizedException('Rota não encontrada!');
      }
      const credentials = Buffer.from(authHash, 'base64').toString('utf-8');
      let username: string;
      let password: string;
      if (credentials) {
        const separatorIndex = credentials.indexOf(':');
        if (separatorIndex !== -1) {
          username = credentials.substring(0, separatorIndex);
          password = credentials.substring(separatorIndex + 1);
        }
      }

      if (!(username === 'wb' && password === 'abcd')) {
        throw new NotFoundException('Rota não encontrada!');
      }
      switch (payload.type) {
        case 'customer.created':
          break;
        case 'customer.updated':
          break;
        case 'card.created':
          break;
        case 'card.updated':
          break;
        case 'card.deleted':
          break;
        case 'address.created':
          break;
        case 'address.updated':
          break;
        case 'address.deleted':
          break;
        case 'plan.created':
          break;
        case 'plan.updated':
          break;
        case 'plan.deleted':
          break;
        case 'planitem.created':
          break;
        case 'planitem.updated':
          break;
        case 'planitem.deleted':
          break;
        case 'subscription.created':
          break;
        case 'subscription.updated':
          break;
        case 'subscription.canceled':
          break;
        case 'subscriptionitem.created':
          break;
        case 'subscriptionitem.updated':
          break;
        case 'subscriptionitem.deleted':
          break;
        case 'discount.created':
          break;
        case 'discount.deleted':
          break;
        case 'order.paid':
          console.log('[webhook.service:52] ', 'OrderPaid');
          return res.status(200).json({
            message: `Pagamento do pedido #${payload.data.id} confirmado!`,
            data: {},
          });
        case 'order.payment_failed':
          break;
        case 'order.create':
          break;
        case 'order.canceled':
          break;
        case 'invoice.created':
          break;
        case 'invoice.paid':
          break;
        case 'invoice.payment_failed':
          break;
        case 'invoice.canceled':
          break;
        case 'charge.paid':
          break;
        case 'charge.payment_failed':
          break;
        case 'charge.pending':
          break;
        case 'charge.refunded':
          break;
        case 'checkout.created':
          break;
        case 'checkout.closed':
          break;
        case 'checkout.canceled':
          break;

        default:
          console.log('[webhook.service:110] ', 'Default');
          return res.status(200).json({ error: 'Evento não reconhecido!' });
      }
    } catch (e) {
      return e;
    }
  }
}
