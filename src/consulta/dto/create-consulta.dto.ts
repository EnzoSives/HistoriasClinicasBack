// src/dtos/consulta.dto.ts
import { IsOptional } from "class-validator";

export class ConsultaDto {
    readonly motivoConsulta?: string;
    readonly observaciones?: string;
    readonly id_paciente: number; // Campo requerido
    readonly fechaConsulta: Date;
  
    @IsOptional()
    readonly anamnesis?: string;
  
    @IsOptional()
    readonly examenFisico?: string;
  
    @IsOptional()
    readonly diagnostico?: string;
  
    @IsOptional()
    readonly tratamiento?: string;
}