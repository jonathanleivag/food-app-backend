import { IsArray } from 'class-validator';
import { CreatePaymentDtoItem } from '../../type';

export class CreatePaymentDto {
  @IsArray({ message: 'Items must be an array' })
  items: CreatePaymentDtoItem[];
}
