// src/entities/consulta.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Paciente } from 'src/paciente/entities/paciente.entity';

@Entity()
export class Consulta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  fechaHoraInicio: Date;

  @Column()
  motivoConsulta: string;

  @Column()
  observaciones: string;

  @ManyToOne(() => Paciente, paciente => paciente.consultas)
  @JoinColumn({name: 'id_paciente'})
  paciente: Paciente;

  constructor(
    fechaHoraInicio: Date= new Date(),
    motivoConsulta: string,
    observaciones: string
  ) {
    this.fechaHoraInicio = fechaHoraInicio;
    this.motivoConsulta = motivoConsulta;
    this.observaciones = observaciones;
    
  }
}