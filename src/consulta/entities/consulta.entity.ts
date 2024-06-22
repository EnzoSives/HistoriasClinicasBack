import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Paciente } from 'src/paciente/entities/paciente.entity';

@Entity()
export class Consulta {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  fechaHoraInicio: Date;

  @Column()
  motivoConsulta: string;

  @Column()
  observaciones: string;

  @ManyToOne(() => Paciente, paciente => paciente.consultas)
  @JoinColumn({name: 'id_paciente'})
  paciente: Paciente;

  constructor(
    motivoConsulta: string,
    observaciones: string
  ) {
    this.motivoConsulta = motivoConsulta;
    this.observaciones = observaciones;
  }
}
