import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { OrderDto } from 'src/orders/dto/new-order.dto';
import { NewCardDto } from './dto/new_card.dto';

@Injectable()
export class PagarmeService {
  private headers = {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: `Basic ${Buffer.from(process.env.PAGARME_SK + ':').toString(
      'base64',
    )}`,
  };

  async getCustomer(order: OrderDto): Promise<any> {
    try {
      // Tenta encontrar cliente pelo email
      if (order?.customer?.email) {
        const emailOptions = {
          method: 'GET',
          url: `${process.env.PAGARME_URL}/customers`,
          params: { email: order?.customer?.email },
          headers: this.headers,
        };
        const tryEmail = await axios.request(emailOptions);
        console.log(tryEmail.data);

        if (tryEmail.data.length > 0) {
          return tryEmail.data[0];
        }
      } else if (order?.customer?.doc) {
        // Se não encontrar, tenta pelo documento
        const documentOptions = {
          method: 'GET',
          url: `${process.env.PAGARME_URL}/customers`,
          params: { document: order?.customer?.doc },
          headers: this.headers,
        };
        const tryDocument = await axios.request(documentOptions);
        console.log(tryDocument.data);

        if (tryDocument.data.length > 0) {
          return tryDocument.data[0];
        } else {
          // Se não encontrar, cria cliente no pagarme
          return await this.createCustomer(order);
        }
      } else {
        // Se não encontrar, cria cliente no pagarme
        return await this.createCustomer(order);
      }
    } catch (error) {
      console.error(error);
    }

    return false;
  }

  async createCustomer(order: OrderDto) {
    try {
      const options = {
        method: 'POST',
        url: 'https://api.pagar.me/core/v5/customers',
        headers: this.headers,
        data: {
          name: order.customer.name,
          email: order.customer.email,
          code: order.customer.id,
          document: order.customer.doc,
          type: order.customer.type,
          document_type: order.customer.doc_type,
          address: {
            line_1: order.customer.address.line_1,
            line_2: order.customer.address.line_2,
            zip_code: order.customer.address.zip_code,
            city: order.customer.address.city,
            state: order.customer.address.state,
            country: order.customer.address.country || 'BR',
          },
          phones: {
            mobile_phone: {
              country_code: order.customer?.phone.country_code || '55',
              area_code: order.customer.phone.area_code,
              number: order.customer.phone.number,
            },
          },
          metadata: { company: 'Avengers' },
        },
      };

      const customer = await axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          return response.data;
        })
        .catch(function (error) {
          console.error(JSON.stringify(error.response.data.errors));
          return false;
        });

      return customer;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async createCard(data: NewCardDto, customer_id: string | undefined) {
    try {
      const options = {
        method: 'POST',
        url: `${process.env.PAGARME_URL}/customers/${
          data.customer_id || customer_id
        }/cards`,
        headers: this.headers,
        data: {
          number: data.number,
          holder_name: data.holder_name,
          holder_document: data.holder_document,
          exp_month: data.exp_month,
          exp_year: data.exp_year,
          cvv: data.cvv,
          billing_address: {
            line_1: data.billing_address.line_1,
            line_2: data.billing_address.line_2,
            zip_code: data.billing_address.zip_code,
            city: data.billing_address.city,
            state: data.billing_address.state,
            country: data.billing_address.country || 'BR',
          },
        },
      };

      const card = await axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          return response.data;
        })
        .catch(function (error) {
          console.error(JSON.stringify(error.response.data.errors));
          return error.response.data.errors;
        });

      return card;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async listCard(customer_id: string) {
    try {
      const options = {
        method: 'GET',
        url: `${process.env.PAGARME_URL}/customers/${customer_id}/cards`,
        headers: this.headers,
      };

      const card = await axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          return response.data;
        })
        .catch(function (error) {
          console.error(JSON.stringify(error.response.data.errors));
          return false;
        });

      return card;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async getCard(customer_id: string, card_id: string) {
    try {
      const options = {
        method: 'GET',
        url: `${process.env.PAGARME_URL}/customers/${customer_id}/cards/${card_id}`,
        headers: this.headers,
      };

      const card = await axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          return response.data;
        })
        .catch(function (error) {
          console.error(JSON.stringify(error.response.data.errors));
          return false;
        });

      return card;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async deleteCard(customer_id: string, card_id: string) {
    try {
      const options = {
        method: 'DELETE',
        url: `${process.env.PAGARME_URL}/customers/${customer_id}/cards/${card_id}`,
        headers: this.headers,
      };

      const card = await axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          return response.data;
        })
        .catch(function (error) {
          console.error(JSON.stringify(error.response.data.errors));
          return false;
        });

      return card;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async createTransaction() {
    //
  }
}
