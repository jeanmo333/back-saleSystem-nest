import {  IsInt,IsPositive, IsString } from "class-validator";

export class CreateAddressDto {
   
   
    @IsString()
    calle: string;


    @IsInt()
    @IsPositive()
    numero: number;

  
    @IsString()
    ciudad: string;
    
 
    @IsString()
    comuna: string;

}