import {
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { CreateDetailDto } from 'src/common/dtos/create-detail.dto';
import { Customer } from '../../customers/entities/customer.entity';
import { Detail } from '../entities/detail.entity';

export class CreateSaleDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  discount: number;

  @IsString()
  @IsOptional()
  customer: Customer;

  @IsArray()
  details?: Detail[];
}
