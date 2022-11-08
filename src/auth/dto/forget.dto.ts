import { IsEmail, IsString } from "class-validator";

export class ForgetDto {

    @IsString()
    @IsEmail()
    email: string;


}