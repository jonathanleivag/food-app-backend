import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Payer } from 'mercadopago/dist/clients/payment/commonTypes';
import { Items } from 'mercadopago/dist/clients/commonTypes';

export type PaymentDocument = Payment & Document;

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id as string;
      delete ret._id;
      return ret;
    },
  },
})
export class Payment {
  @Prop({ type: String, required: true })
  paymentId: string;

  @Prop({ type: String, required: true })
  preference_id: string;

  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: String, required: true })
  status_detail: string;

  @Prop({ type: Object, required: true })
  payment_method: object;

  @Prop({ type: Number, required: true })
  transaction_amount: number;

  @Prop({ type: Date, required: true })
  date_created: Date;

  @Prop({ type: Date })
  date_approved: Date;

  @Prop({ type: [Object], required: true })
  items: Items[];

  @Prop({ type: Object, required: true })
  payer: Payer;

  @Prop({ type: String, required: true })
  additional_info: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
