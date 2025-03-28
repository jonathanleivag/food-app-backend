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

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  ingredients: string[];

  @IsNumber()
  @IsNotEmpty({ message: 'Preparation time is required' })
  preparationTime: number;

  @IsNumber()
  @IsOptional()
  calories: number;
}
