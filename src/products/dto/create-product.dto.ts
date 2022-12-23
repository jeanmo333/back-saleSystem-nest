import {
  IsArray,
  IsBoolean,
  IsEmpty,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
 
  @IsString()
  @IsOptional()
  id?: string;

  @IsString({ message: 'must be a string' })
  @MinLength(1, { message: 'minimo un caracter' })
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  purchase_price: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  sale_price: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  supplier?: string;
}
