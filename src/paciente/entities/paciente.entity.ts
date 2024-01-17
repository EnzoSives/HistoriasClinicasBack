// src/entities/paciente.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Consulta } from 'src/consulta/entities/consulta.entity.ts';

@Entity()
export class Paciente {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ type: 'datetime' })
  fechaHoraInicioHistoriaClinica: Date;

  @OneToMany(() => Consulta, consulta => consulta.paciente)
  consultas: Consulta[];
}
