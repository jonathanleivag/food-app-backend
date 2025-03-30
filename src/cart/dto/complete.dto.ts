import { IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CompleteDto {
  @IsString({ message: 'cartId must be a string' })
  @IsNotEmpty({ message: 'cartId must not be empty' })
  cartId: ObjectId;
}
