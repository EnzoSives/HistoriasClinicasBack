// src/turno/dto/create-turno.dto.ts
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTurnoDto {
  @IsNotEmpty({ message: 'La fecha y hora son requeridas' })
  @IsDateString()
  fechaHora: string;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsNotEmpty({ message: 'El ID del paciente es requerido' })
  @IsNumber()
  id_paciente: number;

  // El controller lo reemplaza por el id_medico del token.
  @IsOptional()
  @IsNumber()
  id_medico?: number;

  @IsOptional()
  @IsString()
  notas?: string;
}