import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class NewPassWordDto {

    @IsString()
    @MinLength(6)
    @MaxLength(50)
 
    password: string;

}