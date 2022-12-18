import { IsString, MinLength, IsEmail, IsOptional, IsObject, IsBoolean } from "class-validator";
import { CreateAddressDto } from '../../common/dtos/create-address.dto';

export class CreateCustomerDto {

    @IsString()
    @MinLength(10)
    rut: string;


    @IsString()
    @MinLength(1)
    name: string;

    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    @MinLength(9)
    phone: string;


    @IsString()
    @IsOptional()
    web?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    address2?: string;


    @IsObject()
    @IsOptional()
    address?: CreateAddressDto
}
