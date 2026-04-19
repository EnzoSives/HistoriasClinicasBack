// src/horario-medico/entities/horario-medico.entity.ts
import { Medico } from 'src/medico/entities/medico.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiaSemana } from 'src/turno/enums/dia-semana.enum';

@Entity()
export class HorarioMedico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_medico: number;

  @ManyToOne(() => Medico)
  @JoinColumn({ name: 'id_medico' })
  medico: Medico;

  @Column({ type: 'int' })
  diaSemana: DiaSemana;

  @Column({ type: 'time' })
  horaInicio: string;

  @Column({ type: 'time' })
  horaFin: string;

  @Column({ type: 'int', default: 30 })
  duracionMinutos: number;

  @Column({ type: 'int', default: 10 })
  maxTurnosPorDia: number;
}
