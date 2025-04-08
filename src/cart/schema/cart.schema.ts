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
      ingredients: { type: [String], required: true },
      extraIngredients: { type: [String] },
      extra: { type: Number, required: true, min: 0 },
      price: { type: Number, required: true },
    },
  ])
  items: {
    _id?: Types.ObjectId;
    product: Types.ObjectId;
    quantity: number;
    ingredients: string[];
    extraIngredients?: string[];
    extra: number;
    price: number;
  }[];

  @Prop({ type: Number, required: true, default: 0 })
  total: number;

  @Prop({ type: Boolean, default: false })
  isCompleted: boolean;

  @Prop({ type: Boolean, default: false })
  isDelivered: boolean;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
