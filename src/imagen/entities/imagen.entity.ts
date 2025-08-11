// src/imagen/entities/imagen.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Paciente } from '../../paciente/entities/paciente.entity';
import { Consulta } from '../../consulta/entities/consulta.entity';

@Entity()
export class Imagen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  path: string;

  @ManyToOne(() => Paciente, (paciente) => paciente.imagenes, { nullable: true })
  paciente: Paciente;

  @ManyToOne(() => Consulta, (consulta) => consulta.imagenes, { nullable: true })
  consulta: Consulta;
}