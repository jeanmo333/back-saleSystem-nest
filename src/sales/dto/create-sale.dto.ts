import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Detail } from '../entities/detail.entity';
import { CreateDetailDto } from './create-detail.dto';

export class CreateSaleDto {

  @IsString()
  @IsOptional()
  id?: string;


  @IsInt()
  @IsPositive()
  @IsOptional()
  discount?: number;

  @IsString()
  @IsOptional()
  customer?: string;


  @IsNumber()
  @IsOptional()
  total?:  number;

  @IsNumber()
  @IsOptional()
  numberOfItems: number;

  @IsNumber()
  @IsOptional()
  subTotal     : number;

  @IsArray()
  details?:  Detail[];
}
