// src/dtos/consulta.dto.ts
export class ConsultaDto {
    readonly fechaHoraInicio: Date;
    readonly motivoConsulta: string;
    readonly observaciones: string;
    readonly id_paciente?: number;
  }
  