// src/entities/paciente.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Consulta } from 'src/consulta/entities/consulta.entity';

@Entity()
export class Paciente {
  @PrimaryGeneratedColumn()
  id_paciente: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  dni: string;

  @Column()
  sexo: string;

  @Column()
  edad: number;

  @Column({ type: 'date' })
  fechaNacimiento: Date;

  @Column()
  lugarNacimiento: string;

  @Column()
  direccion: string;

  @Column()
  telefonoFijo: string;

  @Column()
  telefonoCelular: string;

  @Column()
  ocupacion: string;

  @Column()
  estadoCivil: string;

  @Column()
  obraSocial: string;

  @Column()
  afiliadoObraSocial: string;

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

  @Column({ nullable: true })
  imagen: string;
  @Column({ nullable: true })
  imagen2: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  fechaHoraInicioHistoriaClinica: Date;

  @OneToMany(() => Consulta, consulta => consulta.paciente)
  consultas: Consulta[];

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
  }
}
