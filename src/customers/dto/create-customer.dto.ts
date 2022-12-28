import { IsString, MinLength, IsEmail, IsOptional, IsObject, IsBoolean } from "class-validator";
import { CreateAddressDto } from '../../common/dtos/create-address.dto';

export class CreateCustomerDto {
 
    @IsOptional()
    @IsString()
    id?: string;

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
    @MinLength(9,{message:"telefono minimo 9 digitos"})
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
