import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from 'src/common/enum/rol.enum';

export class RegisterDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  username: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;

  @Transform(({ value }) => value.trim())
  @IsEmail()
  email: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role; // Valor opcional, se puede forzar desde el backend si no se quiere permitir desde el cliente
}
