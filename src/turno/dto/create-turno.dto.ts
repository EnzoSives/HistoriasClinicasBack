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

  @IsNotEmpty({ message: 'El ID del médico es requerido' })
  @IsNumber()
  id_medico: number;

  @IsOptional()
  @IsString()
  notas?: string;
}