import { Transform } from 'class-transformer';
import{MinLength, MaxLength, IsString, IsEmail} from 'class-validator';

export class loginDto{

    @IsString()
    @IsEmail()
    email: string;
    @MinLength(6)
    @MaxLength(15)
    @Transform(({value}) => value.trim())
    password: string;
}