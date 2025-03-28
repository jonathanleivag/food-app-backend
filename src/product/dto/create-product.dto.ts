import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Price is required' })
  price: number;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  category: string;

  @IsUrl()
  @IsNotEmpty({ message: 'Image URL is required' })
  imageUrl: string;

  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;

  @IsArray({ message: 'Base ingredients must be an array' })
  @IsNotEmpty({ message: 'Base ingredients are required' })
  @IsString({ each: true, message: 'Each ingredient must be a string' })
  baseIngredients: string[];

  @IsArray({ message: 'Extra ingredients must be an array' })
  @IsOptional()
  @IsString({ each: true, message: 'Each ingredient must be a string' })
  extraIngredients: string[];

  @IsNumber()
  @IsNotEmpty({ message: 'Preparation time is required' })
  preparationTime: number;

  @IsNumber()
  @IsOptional()
  calories: number;
}
