import {
    IsInt,
    IsOptional,
    IsPositive,
    IsString,
  } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';
import { Sale } from '../entities/sale.entity';

  export class CreateDetailDto {
    @IsString()
    @IsOptional()
    id?: string;
    
    @IsInt()
    @IsPositive()
    quantity: number;
  
    @IsString()
    @IsOptional()
    product: Product;

    // @IsString()
    // @IsOptional()
    // sale?: Sale;
  }