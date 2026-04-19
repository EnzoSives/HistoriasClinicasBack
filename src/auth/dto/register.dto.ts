import { Transform } from 'class-transformer';
import { 
  IsEmail, 
  IsEnum,
  IsNotEmpty, 
  IsString, 
  MinLength, 
  IsOptional,
  Matches,
  Length
} from 'class-validator';
import { Role } from 'src/common/enum/rol.enum';

export class RegisterMedicoDto {
  // ========== DATOS DE USUARIO ==========
  @Transform(({ value }) => value && typeof value === 'string' ? value.trim() : value)
  @IsString({ message: 'El username debe ser un texto' })
  @IsNotEmpty({ message: 'El username es requerido' })
  @Length(3, 50, { message: 'El username debe tener entre 3 y 50 caracteres' })
  username: string;

  @Transform(({ value }) => value && typeof value === 'string' ? value.trim() : value)
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password: string;

  // ========== DATOS DE MÉDICO ==========
  @Transform(({ value }) => value && typeof value === 'string' ? value.trim() : value)
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  nombre: string;

  @Transform(({ value }) => value && typeof value === 'string' ? value.trim() : value)
  @IsString({ message: 'El apellido debe ser un texto' })
  @IsNotEmpty({ message: 'El apellido es requerido' })
  @Length(2, 100, { message: 'El apellido debe tener entre 2 y 100 caracteres' })
  apellido: string;

  @Transform(({ value }) => value && typeof value === 'string' ? value.trim() : value)
  @IsString({ message: 'El DNI debe ser un texto' })
  @IsNotEmpty({ message: 'El DNI es requerido' })
  @Matches(/^\d{7,8}$/, { message: 'El DNI debe tener 7 u 8 dígitos' })
  dni: string;

  @Transform(({ value }) => value && typeof value === 'string' ? value.trim() : value)
  @IsString({ message: 'La especialidad debe ser un texto' })
  @IsNotEmpty({ message: 'La especialidad es requerida' })
  @Length(2, 200, { message: 'La especialidad debe tener entre 2 y 200 caracteres' })
  especialidad: string;

  @Transform(({ value }) => value && typeof value === 'string' ? value.trim() : value)
  @IsString({ message: 'La matrícula debe ser un texto' })
  @IsNotEmpty({ message: 'La matrícula es requerida' })
  @Length(3, 50, { message: 'La matrícula debe tener entre 3 y 50 caracteres' })
  matricula: string;

  // ========== CAMPOS OPCIONALES ==========
  @Transform(({ value }) => value && typeof value === 'string' ? value.trim() : value)
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un texto' })
  @Matches(/^[\d\s\-\+\(\)]+$/, { message: 'El teléfono tiene un formato inválido' })
  telefono?: string;

  @Transform(({ value }) => value && typeof value === 'string' ? value.trim() : value)
  @IsOptional()
  @IsString({ message: 'El colegio médico debe ser un texto' })
  @Length(2, 200, { message: 'El colegio médico debe tener entre 2 y 200 caracteres' })
  colegioMedico?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'El rol debe ser un valor válido' })
  role?: Role;
} 