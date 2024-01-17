// src/dtos/consulta.dto.ts
export class ConsultaDto {
    readonly fechaHoraInicio: Date;
    readonly antecedentesPersonalesMedicos: string;
    readonly antecedentesQuirurgicos: string;
    readonly alergias: string;
    readonly antecedentesHeredoFamiliares: string;
    readonly habitosToxicos: string;
    readonly medicacionHabitual: string;
    readonly examenFisicoHabito: string;
    readonly examenFisicoPeso: number;
    readonly examenFisicoTalla: number;
    readonly examenFisicoIMC: number;
    readonly examenFisicoTA: string;
    readonly examenFisicoFC: string;
    readonly examenFisicoFR: string;
    readonly examenFisicoTemperatura: string;
    readonly examenFisicoSistemaNervioso: string;
    readonly examenFisicoAPCardiovascular: string;
    readonly examenFisicoAPRespiratorio: string;
    readonly examenFisicoAPDigestivo: string;
    readonly examenFisicoAPGenitourinario: string;
    readonly examenFisicoSistemaEndocrino: string;
    readonly examenFisicoSistemaHematopoyetico: string;
    readonly examenFisicoSistemaMusculoEsqueletico: string;
    readonly examenFisicoPielAnexos: string;
    readonly motivoConsulta: string;
    readonly observaciones: string;
  }
  