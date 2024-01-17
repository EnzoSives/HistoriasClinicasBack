// src/entities/consulta.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Paciente } from 'src/paciente/entities/paciente.entity.ts';

@Entity()
export class Consulta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  fechaHoraInicio: Date;

  @Column()
  antecedentesPersonalesMedicos: string;

  @Column()
  antecedentesQuirurgicos: string;

  @Column()
  alergias: string;

  @Column()
  antecedentesHeredoFamiliares: string;

  @Column()
  habitosToxicos: string;

  @Column()
  medicacionHabitual: string;

  @Column()
  examenFisicoHabito: string;

  @Column()
  examenFisicoPeso: number;

  @Column()
  examenFisicoTalla: number;

  @Column()
  examenFisicoIMC: number;

  @Column()
  examenFisicoTA: string;

  @Column()
  examenFisicoFC: string;

  @Column()
  examenFisicoFR: string;

  @Column()
  examenFisicoTemperatura: string;

  @Column()
  examenFisicoSistemaNervioso: string;

  @Column()
  examenFisicoAPCardiovascular: string;

  @Column()
  examenFisicoAPRespiratorio: string;

  @Column()
  examenFisicoAPDigestivo: string;

  @Column()
  examenFisicoAPGenitourinario: string;

  @Column()
  examenFisicoSistemaEndocrino: string;

  @Column()
  examenFisicoSistemaHematopoyetico: string;

  @Column()
  examenFisicoSistemaMusculoEsqueletico: string;

  @Column()
  examenFisicoPielAnexos: string;

  @Column()
  motivoConsulta: string;

  @Column()
  observaciones: string;

  @ManyToOne(() => Paciente, paciente => paciente.consultas)
  paciente: Paciente;
}
