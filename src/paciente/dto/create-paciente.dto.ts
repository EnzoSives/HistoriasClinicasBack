import { IsOptional } from "class-validator";

export class PacienteDto {
  @IsOptional()
  readonly nombre?: string;
  @IsOptional()
  readonly apellido?: string;
  @IsOptional()
  readonly dni?: string;
  @IsOptional()
  readonly sexo?: string;
  @IsOptional()
  readonly edad?: number;
  @IsOptional()
  readonly fechaNacimiento?: Date;
  @IsOptional()
  readonly lugarNacimiento?: string;
  @IsOptional()
  readonly direccion?: string;
  @IsOptional()
  readonly telefonoFijo?: string;
  @IsOptional()
  readonly telefonoCelular?: string;
  @IsOptional()
  readonly ocupacion?: string;
  @IsOptional()
  readonly estadoCivil?: string;
  @IsOptional()
  readonly obraSocial?: string;
  @IsOptional()
  readonly afiliadoObraSocial?: string;
  @IsOptional()
  readonly antecedentesPersonalesMedicos?: string;
  @IsOptional()
  readonly antecedentesQuirurgicos?: string;
  @IsOptional()
  readonly alergias?: string;
  @IsOptional()
  readonly antecedentesHeredoFamiliares?: string;
  @IsOptional()
  readonly habitosToxicos?: string;
  @IsOptional()
  readonly medicacionHabitual?: string;
  @IsOptional()
  readonly examenFisicoHabito?: string;
  @IsOptional()
  readonly examenFisicoPeso?: number;
  @IsOptional()
  readonly examenFisicoTalla?: number;
  @IsOptional()
  readonly examenFisicoIMC?: number;
  @IsOptional()
  readonly examenFisicoTA?: string;
  @IsOptional()
  readonly examenFisicoFC?: string;
  @IsOptional()
  readonly examenFisicoFR?: string;
  @IsOptional()
  readonly examenFisicoTemperatura?: string;
  @IsOptional()
  readonly examenFisicoSistemaNervioso?: string;
  @IsOptional()
  readonly examenFisicoAPCardiovascular?: string;
  @IsOptional()
  readonly examenFisicoAPRespiratorio?: string;
  @IsOptional()
  readonly examenFisicoAPDigestivo?: string;
  @IsOptional()
  readonly examenFisicoAPGenitourinario?: string;
  @IsOptional()
  readonly examenFisicoSistemaEndocrino?: string;
  @IsOptional()
  readonly examenFisicoSistemaHematopoyetico?: string;
  @IsOptional()
  readonly examenFisicoSistemaMusculoEsqueletico?: string;
  @IsOptional()
  readonly examenFisicoPielAnexos?: string; 
  @IsOptional()
  readonly primerObservacion?: string;
  @IsOptional()
  readonly imagen?: string;
  @IsOptional()
  readonly imagen2?: string;
  @IsOptional()
  readonly fechaCreacion?: Date;
  readonly id_medico?: number; // Asegúrate de que este campo sea opcional si no siempre se proporciona
}
