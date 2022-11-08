import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class NewPassWordDto {

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password Uppercase, lowercase, number'
    })
 
    password: string;

}