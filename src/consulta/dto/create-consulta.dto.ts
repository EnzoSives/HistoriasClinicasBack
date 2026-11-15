// src/dtos/consulta.dto.ts
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ConsultaDto {
    @IsOptional() @IsString()
    readonly motivoConsulta?: string;
    @IsOptional() @IsString()
    readonly observaciones?: string;
    @Type(() => Number) @IsInt()
    readonly id_paciente: number; // Campo requerido
    @IsOptional() @Type(() => Number) @IsInt()
    readonly id_medico: number; // Campo requerido
    @IsDateString()
    readonly fechaConsulta: Date;
  
    @IsOptional()
    @IsString()
    readonly anamnesis?: string;
  
    @IsOptional()
    @IsString()
    readonly examenFisico?: string;
  
    @IsOptional()
    @IsString()
    readonly diagnostico?: string;
  
    @IsOptional()
    @IsString()
    readonly tratamiento?: string;

    @IsOptional()
    @IsString()
    readonly laboratorios?: string;
}
