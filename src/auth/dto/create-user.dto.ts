import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class CreateUserDto {

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password Uppercase, lowercase, number'
    })
    password: string;

    @IsString()
    @MinLength(1)
    name: string;

    
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    roles : string[]

    

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

}