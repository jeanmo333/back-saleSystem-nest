import {
  IsInt,
  IsPositive,
  IsString,
} from 'class-validator';
import { Product } from 'src/products/entities/product.entity';

export class CreateDetailDto {
  @IsInt()
  @IsPositive()
  amount: number;

  @IsString()
  product: Product;
}
