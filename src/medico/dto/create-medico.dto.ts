import { IsString, IsOptional, IsBoolean, Matches, Length } from 'class-validator';

export class CreateMedicoDto {
  // ... (campos existentes con sus validadores)

  @IsString({ message: 'El DNI debe ser un texto' })
  @Matches(/^\d{7,8}$/, { message: 'El DNI debe tener 7 u 8 dígitos' })
  dni: string;

  @IsString({ message: 'El teléfono debe ser un texto' })
  @IsOptional()
  telefono?: string;

  @IsString({ message: 'La especialidad debe ser un texto' })
  @Length(2, 100, { message: 'La especialidad debe tener entre 2 y 100 caracteres' })
  especialidad: string;

  @IsString({ message: 'La matrícula debe ser un texto' })
  matricula: string;

  @IsString({ message: 'El colegio médico debe ser un texto' })
  @IsOptional()
  colegioMedico?: string;

  // --- CAMPOS A AGREGAR ---
  @IsString({ message: 'La dirección del consultorio debe ser texto'})
  @IsOptional()
  direccionConsultorio?: string;

  @IsString({ message: 'El teléfono del consultorio debe ser texto'})
  @IsOptional()
  telefonoConsultorio?: string;

  @IsString({ message: 'El horario de atención debe ser texto'})
  @IsOptional()
  horarioAtencion?: string;

  @IsString({ message: 'Las obras sociales deben ser texto'})
  @IsOptional() // Podrías considerar validación más específica si es un formato particular
  obrasSocialesAcepta?: string;

  @IsString({ message: 'La biografía debe ser texto'})
  @IsOptional()
  biografia?: string;

  @IsString({ message: 'La foto debe ser una URL (texto)'})
  @IsOptional()
  // @IsUrl({}, { message: 'La foto debe ser una URL válida' }) // Descomenta si quieres validar que sea una URL
  foto?: string;

  @IsBoolean({ message: 'Activo debe ser un valor booleano' })
  @IsOptional()
  activo?: boolean;
  // --- FIN CAMPOS A AGREGAR ---
}