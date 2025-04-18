import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CompleteDto {
  @IsString({ message: 'cartId must be a string' })
  @IsNotEmpty({ message: 'cartId must not be empty' })
  cartId: ObjectId;

  @IsString({ message: 'code must be a string' })
  @IsOptional()
  code: string;
}
