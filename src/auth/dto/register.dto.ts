import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class registerDto{
    @Transform(({value}) => value.trim())
    @IsString()
    @IsNotEmpty()
    username: string;
    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(6)
    password: string;
    @IsEmail()
    email:string;
    

}