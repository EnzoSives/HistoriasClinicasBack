// src/turno/entities/turno.entity.ts
import { Medico } from 'src/medico/entities/medico.entity';
import { Paciente } from 'src/paciente/entities/paciente.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { EstadoTurno } from '../enums/estado-turno.enum';

@Entity()
export class Turno {
  @PrimaryGeneratedColumn()
  id_turno: number;

  @Column({ type: 'datetime' })
  fechaHora: Date;

  @Column({ nullable: true })
  motivo: string;

  @Column({
    type: 'enum',
    enum: EstadoTurno,
    default: EstadoTurno.PENDIENTE,
  })
  estado: EstadoTurno;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @ManyToOne(() => Paciente, { eager: true }) // eager: true carga el paciente automáticamente
  @JoinColumn({ name: 'id_paciente' })
  paciente: Paciente;
  @Column()
  id_paciente: number;

  @ManyToOne(() => Medico)
  @JoinColumn({ name: 'id_medico' })
  medico: Medico;
  @Column()
  id_medico: number;

  @CreateDateColumn()
  fechaCreacion: Date;
}