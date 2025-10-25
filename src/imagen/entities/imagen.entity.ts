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

  // Si se elimina el paciente, eliminar las imágenes asociadas
  @ManyToOne(() => Paciente, (paciente) => paciente.imagenes, { nullable: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  paciente: Paciente;

  // Si se elimina la consulta, eliminar las imágenes asociadas
  @ManyToOne(() => Consulta, (consulta) => consulta.imagenes, { nullable: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  consulta: Consulta;
}