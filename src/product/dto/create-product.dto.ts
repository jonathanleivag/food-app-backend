import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
  IsUrl,
  IsNotEmpty,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { extraIngredients } from '../../type';

export class CreateProductDto {
  @Transform(({ value }: { value: string }) => value.trim())
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Price is required' })
  price: number;

  @Transform(({ value }: { value: string }) => value.trim())
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  description: string;

  @Transform(({ value }: { value: string }) => value.trim())
  @IsString({ message: 'Category must be a string' })
  @IsNotEmpty({ message: 'Category is required' })
  @MinLength(3, { message: 'Category must be at least 3 characters long' })
  category: string;

  @IsUrl()
  @IsNotEmpty({ message: 'Image URL is required' })
  imageUrl: string;

  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;

  @IsArray({ message: 'Ingredients must be an array' })
  @IsNotEmpty({ message: 'Ingredients are required' })
  @IsString({ each: true, message: 'Each ingredient must be a string' })
  ingredients: string[];

  @IsArray({ message: 'Base ingredients must be an array' })
  @IsNotEmpty({ message: 'Base ingredients are required' })
  @IsString({ each: true, message: 'Each ingredient must be a string' })
  baseIngredients: string[];

  @IsArray({ message: 'Extra ingredients must be an array' })
  @IsOptional()
  @ValidateNested({ each: true })
  extraIngredients: extraIngredients[];

  @IsNumber()
  @IsNotEmpty({ message: 'Preparation time is required' })
  preparationTime: number;

  @IsNumber()
  @IsOptional()
  calories: number;
}
