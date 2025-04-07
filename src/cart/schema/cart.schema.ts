import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schema/user.schema';
import { Product } from '../../product/schema/product.schema';

export type CartDocument = Cart & Document;

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
export class Cart {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop([
    {
      product: { type: Types.ObjectId, ref: Product.name, required: true },
      quantity: { type: Number, required: true, min: 1 },
      extra: { type: Number, required: true, min: 0 },
      price: { type: Number, required: true },
    },
  ])
  items: {
    product: Types.ObjectId;
    quantity: number;
    extra: number;
    price: number;
  }[];

  @Prop({ type: Number, required: true, default: 0 })
  total: number;

  @Prop({ type: Boolean, default: false })
  isCompleted: boolean;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
