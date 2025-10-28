// src/consulta/entities/consulta.entity.ts (ACTUALIZADA para incluir relación con médico)
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Paciente } from 'src/paciente/entities/paciente.entity';
import { Medico } from 'src/medico/entities/medico.entity';
import { Imagen } from 'src/imagen/entities/imagen.entity';

@Entity()
export class Consulta {
  @PrimaryGeneratedColumn()
  id_consulta: number;

  @Column({ type: 'datetime' })
  fechaConsulta: Date;

  @Column({ type: 'text', nullable: true })
  motivoConsulta?: string;

  @Column({ type: 'text', nullable: true })
  anamnesis?: string;

  @Column({ type: 'text', nullable: true })
  examenFisico?: string;

  @Column({ type: 'text', nullable: true })
  diagnostico?: string;

  @Column({ type: 'text', nullable: true })
  tratamiento?: string;

  @Column({ type: 'varchar', nullable: true, length: 1000 })
  observaciones?: string;

  @Column({ type: 'varchar', nullable: true, length: 1000 })
  laboratorios?: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  fechaCreacion: Date;

  // Relación con Paciente
  @ManyToOne(() => Paciente, paciente => paciente.consultas, { 
    nullable: false, 
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'id_paciente' })
  paciente: Paciente;

  @Column()
  id_paciente: number;

  // Relación con Médico
  @ManyToOne(() => Medico, medico => medico.consultas, { 
    nullable: false 
  })
  @JoinColumn({ name: 'id_medico' })
  medico: Medico;

  @Column()
  id_medico: number;

  @OneToMany(() => Imagen, (imagen) => imagen.consulta, { cascade: true })
  imagenes: Imagen[];
}