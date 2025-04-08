import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Schema } from 'mongoose';
import {
  PaymentDocument,
  Payment as PaymentModule,
} from './schema/payment.schema';
import success from './templates/success';
import failure from './templates/failure';
import pending from './templates/pending';
import { UserService } from '../user/user.service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class PaymentService {
  private preference: Preference;
  private payment: Payment;
  private successTemplate: string;
  private failureTemplate: string;
  private pendingTemplate: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(PaymentModule.name)
    private readonly paymentModule: Model<PaymentDocument>,
    private readonly userService: UserService,
    private readonly cartService: CartService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const client = new MercadoPagoConfig({
      accessToken:
        this.configService.get<string>(
          'mercadopago.ACCESS_TOKEN_MERCADOPAGO',
        ) || '',
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.preference = new Preference(client);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.payment = new Payment(client);
    this.successTemplate = success;
    this.failureTemplate = failure;
    this.pendingTemplate = pending;
  }

  async create(
    createPaymentDto: CreatePaymentDto,
    userId: string,
    cardId: string,
  ) {
    try {
      const user = await this.userService.findOne(
        userId as unknown as Schema.Types.ObjectId,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const result = await this.preference.create({
        body: {
          additional_info: cardId,
          payer: {
            name: user.name,
            email: user.email,
          },
          items: createPaymentDto.items,
          back_urls: {
            success: `${this.configService.get<string>('URL_API')}/payment/success/${cardId}`,
            failure: `${this.configService.get<string>('URL_API')}/payment/failure`,
            pending: `${this.configService.get<string>('URL_API')}/payment/pending`,
          },
          auto_return: 'approved',
        },
      });

      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        init_point: result.init_point,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      console.log(error);
      throw error;
    }
  }

  async paymentStatus(paymentId: string, preference_id: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const preference = await this.preference.get({
        preferenceId: preference_id,
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const payment = await this.payment.get({ id: paymentId });
      const response = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        status: payment.status,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        status_detail: payment.status_detail,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        payment_method: payment.payment_method,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        transaction_amount: payment.transaction_amount,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        date_created: payment.date_created,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        date_approved: payment.date_approved,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        items: preference.items,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        payer: preference.payer,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        additional_info: preference.additional_info,
        preference_id: preference_id,
        paymentId: paymentId,
      };
      return response;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error getting payment status:', error.message);
      }
      throw error;
    }
  }

  async paymentSuccess(
    paymentId: {
      paymentId: string;
      preference_id: string;
    },
    idCard: ObjectId,
  ) {
    try {
      const response = await this.paymentStatus(
        paymentId.paymentId,
        paymentId.preference_id,
      );
      await this.paymentModule.create(response);

      await this.cartService.completeCart(idCard);

      return (
        this.successTemplate
          .replace(
            '{{statusColor}}',
            response.status === 'approved' ? '#4CAF50' : '#f44336',
          )
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          .replace('{{status}}', response.status!.toUpperCase())
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          .replace('{{amount}}', response.transaction_amount!.toString())
          .replace(
            '{{product}}',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
            response.items!.map((item: any) => item.title).join(', '),
          )
          .replace(
            '{{paymentMethod}}',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            response.payment_method?.type || '',
          )
          .replace('{{transactionId}}', paymentId.paymentId)
          .replace(
            '{{date}}',
            new Date(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              response.date_approved! || response.date_created!,
            ).toLocaleString(),
          )
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error getting payment status:', error.message);
      }
      throw error;
    }
  }

  async paymentFailure(paymentId: {
    paymentId: string;
    preference_id: string;
  }) {
    try {
      const response = await this.paymentStatus(
        paymentId.paymentId,
        paymentId.preference_id,
      );
      await this.paymentModule.create(response);

      return (
        this.failureTemplate
          .replace(
            '{{statusColor}}',
            response.status === 'approved' ? '#4CAF50' : '#f44336',
          )
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          .replace('{{status}}', response.status!.toUpperCase())
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          .replace('{{amount}}', response.transaction_amount!.toString())
          .replace(
            '{{product}}',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
            response.items!.map((item: any) => item.title).join(', '),
          )
          .replace(
            '{{paymentMethod}}',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            response.payment_method?.type || '',
          )
          .replace('{{transactionId}}', paymentId.paymentId)
          .replace(
            '{{date}}',
            new Date(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              response.date_approved! || response.date_created!,
            ).toLocaleString(),
          )
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error getting payment status:', error.message);
      }
      throw error;
    }
  }
  async paymentPending(paymentId: {
    paymentId: string;
    preference_id: string;
  }) {
    try {
      const response = await this.paymentStatus(
        paymentId.paymentId,
        paymentId.preference_id,
      );
      await this.paymentModule.create(response);

      return (
        this.pendingTemplate
          .replace(
            '{{statusColor}}',
            response.status === 'approved' ? '#4CAF50' : 'yellow',
          )
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          .replace('{{status}}', response.status!.toUpperCase())
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          .replace('{{amount}}', response.transaction_amount!.toString())
          .replace(
            '{{product}}',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
            response.items!.map((item: any) => item.title).join(', '),
          )
          .replace(
            '{{paymentMethod}}',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            response.payment_method?.type || '',
          )
          .replace('{{transactionId}}', paymentId.paymentId)
          .replace(
            '{{date}}',
            new Date(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              response.date_approved! || response.date_created!,
            ).toLocaleString(),
          )
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error getting payment status:', error.message);
      }
      throw error;
    }
  }
}
