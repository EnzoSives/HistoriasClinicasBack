// src/entities/paciente.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Consulta } from 'src/consulta/entities/consulta.entity';

@Entity()
export class Paciente {
  @PrimaryGeneratedColumn()
  id_paciente: number;

  @Column({ nullable: true })
  nombre?: string;

  @Column({ nullable: true })
  apellido?: string;

  @Column({ nullable: true })
  dni?: string;

  @Column({ nullable: true })
  sexo?: string;

  @Column({ nullable: true })
  edad?: number;

  @Column({ type: 'date', nullable: true })
  fechaNacimiento?: Date;

  @Column({ nullable: true })
  lugarNacimiento?: string;

  @Column({ nullable: true })
  direccion?: string;

  @Column({ nullable: true })
  telefonoFijo?: string;

  @Column({ nullable: true })
  telefonoCelular?: string;

  @Column({ nullable: true })
  ocupacion?: string;

  @Column({ nullable: true })
  estadoCivil?: string;

  @Column({ nullable: true })
  obraSocial?: string;

  @Column({ nullable: true })
  afiliadoObraSocial?: string;

  @Column({ nullable: true })
  antecedentesPersonalesMedicos?: string;

  @Column({ nullable: true })
  antecedentesQuirurgicos?: string;

  @Column({ nullable: true })
  alergias?: string;

  @Column({ nullable: true })
  antecedentesHeredoFamiliares?: string;

  @Column({ nullable: true })
  habitosToxicos?: string;

  @Column({ nullable: true })
  medicacionHabitual?: string;

  @Column({ nullable: true })
  examenFisicoHabito?: string;

  @Column({ nullable: true })
  examenFisicoPeso?: number;

  @Column({ nullable: true })
  examenFisicoTalla?: number;

  @Column({ nullable: true })
  examenFisicoIMC?: number;

  @Column({ nullable: true })
  examenFisicoTA?: string;

  @Column({ nullable: true })
  examenFisicoFC?: string;

  @Column({ nullable: true })
  examenFisicoFR?: string;

  @Column({ nullable: true })
  examenFisicoTemperatura?: string;

  @Column({ nullable: true })
  examenFisicoSistemaNervioso?: string;

  @Column({ nullable: true })
  examenFisicoAPCardiovascular?: string;

  @Column({ nullable: true })
  examenFisicoAPRespiratorio?: string;

  @Column({ nullable: true })
  examenFisicoAPDigestivo?: string;

  @Column({ nullable: true })
  examenFisicoAPGenitourinario?: string;

  @Column({ nullable: true })
  examenFisicoSistemaEndocrino?: string;

  @Column({ nullable: true })
  examenFisicoSistemaHematopoyetico?: string;

  @Column({ nullable: true })
  examenFisicoSistemaMusculoEsqueletico?: string;

  @Column({ nullable: true })
  examenFisicoPielAnexos?: string;

  @Column({ length: 250, nullable: true })
  primerObservacion?: string;

  @Column({ nullable: true })
  imagen?: string;

  @Column({ nullable: true })
  imagen2?: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  fechaHoraInicioHistoriaClinica?: Date;

  @OneToMany(() => Consulta, consulta => consulta.paciente)
  consultas?: Consulta[];

  constructor(
    nombre: string,
    apellido: string,
    dni: string,
    sexo: string,
    edad: number,
    fechaNacimiento: Date,
    lugarNacimiento: string,
    direccion: string,
    telefonoFijo: string,
    telefonoCelular: string,
    ocupacion: string,
    estadoCivil: string,
    obraSocial: string,
    afiliadoObraSocial: string,
    antecedentesPersonalesMedicos: string,
    antecedentesQuirurgicos: string,
    alergias: string,
    antecedentesHeredoFamiliares: string,
    habitosToxicos: string,
    medicacionHabitual: string,
    examenFisicoHabito: string,
    examenFisicoPeso: number,
    examenFisicoTalla: number,
    examenFisicoIMC: number,
    examenFisicoTA: string,
    examenFisicoFC: string,
    examenFisicoFR: string,
    examenFisicoTemperatura: string,
    examenFisicoSistemaNervioso: string,
    examenFisicoAPCardiovascular: string,
    examenFisicoAPRespiratorio: string,
    examenFisicoAPDigestivo: string,
    examenFisicoAPGenitourinario: string,
    examenFisicoSistemaEndocrino: string,
    examenFisicoSistemaHematopoyetico: string,
    examenFisicoSistemaMusculoEsqueletico: string,
    examenFisicoPielAnexos: string,
    primerObservacion: string

  ) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.sexo = sexo;
    this.edad = edad;
    this.fechaNacimiento = fechaNacimiento;
    this.lugarNacimiento = lugarNacimiento;
    this.direccion = direccion;
    this.telefonoFijo = telefonoFijo;
    this.telefonoCelular = telefonoCelular;
    this.ocupacion = ocupacion;
    this.estadoCivil = estadoCivil;
    this.obraSocial = obraSocial;
    this.afiliadoObraSocial = afiliadoObraSocial;
    this.antecedentesPersonalesMedicos = antecedentesPersonalesMedicos;
    this.antecedentesQuirurgicos = antecedentesQuirurgicos;
    this.alergias = alergias;
    this.antecedentesHeredoFamiliares = antecedentesHeredoFamiliares;
    this.habitosToxicos = habitosToxicos;
    this.medicacionHabitual = medicacionHabitual;
    this.examenFisicoHabito = examenFisicoHabito;
    this.examenFisicoPeso = examenFisicoPeso;
    this.examenFisicoTalla = examenFisicoTalla;
    this.examenFisicoIMC = examenFisicoIMC;
    this.examenFisicoTA = examenFisicoTA;
    this.examenFisicoFC = examenFisicoFC;
    this.examenFisicoFR = examenFisicoFR;
    this.examenFisicoTemperatura = examenFisicoTemperatura;
    this.examenFisicoSistemaNervioso = examenFisicoSistemaNervioso;
    this.examenFisicoAPCardiovascular = examenFisicoAPCardiovascular;
    this.examenFisicoAPRespiratorio = examenFisicoAPRespiratorio;
    this.examenFisicoAPDigestivo = examenFisicoAPDigestivo;
    this.examenFisicoAPGenitourinario = examenFisicoAPGenitourinario;
    this.examenFisicoSistemaEndocrino = examenFisicoSistemaEndocrino;
    this.examenFisicoSistemaHematopoyetico = examenFisicoSistemaHematopoyetico;
    this.examenFisicoSistemaMusculoEsqueletico = examenFisicoSistemaMusculoEsqueletico;
    this.examenFisicoPielAnexos = examenFisicoPielAnexos;
    this.primerObservacion = primerObservacion;
  }
}
