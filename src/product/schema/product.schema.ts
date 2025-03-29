import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  versionKey: false,
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id as string;
      delete ret._id;
      return ret;
    },
  },
})
export class Product {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ required: true, type: [String] })
  ingredients: string[];

  @Prop({ type: [String], required: true })
  baseIngredients: string[];

  @Prop({ type: [String], default: [] })
  extraIngredients: string[];

  @Prop({ required: true })
  preparationTime: number;

  @Prop({ default: 0 })
  calories: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
