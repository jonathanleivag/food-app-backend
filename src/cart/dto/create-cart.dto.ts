import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateCartDto {
  @IsString()
  @IsNotEmpty()
  productId: ObjectId;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  extra: number;
}
