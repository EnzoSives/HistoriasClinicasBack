import { IsString, IsEmail, MinLength, IsEnum, IsOptional } from "class-validator";
import { Role } from "src/common/enum/rol.enum";

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}