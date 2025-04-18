import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateCartDto {
  @IsString()
  @IsNotEmpty()
  productId: ObjectId;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @IsArray({ message: 'Base ingredients must be an array' })
  @IsNotEmpty({ message: 'Base ingredients are required' })
  @IsString({ each: true, message: 'Each ingredient must be a string' })
  ingredients: string[];

  @IsArray({ message: 'Extra ingredients must be an array' })
  @IsOptional()
  @IsString({ each: true, message: 'Each ingredient must be a string' })
  extraIngredients: string[];

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  extra: number;
}
