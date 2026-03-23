// src/entities/paciente.entity.ts (ACTUALIZADA)
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { Consulta } from 'src/consulta/entities/consulta.entity';
import { Medico } from 'src/medico/entities/medico.entity';
import { Imagen } from 'src/imagen/entities/imagen.entity';

export interface DatosPaciente {
  nombre?: string;
  apellido?: string;
  dni?: string;
  sexo?: string;
  edad?: number;
  fechaNacimiento?: Date;
  lugarNacimiento?: string;
  direccion?: string;
  telefonoFijo?: string;
  telefonoCelular?: string;
  ocupacion?: string;
  estadoCivil?: string;
  obraSocial?: string;
  afiliadoObraSocial?: string;
  antecedentesPersonalesMedicos?: string;
  antecedentesQuirurgicos?: string;
  alergias?: string;
  antecedentesHeredoFamiliares?: string;
  antecedentesGinecoObstetricos?: string;
  habitosToxicos?: string;
  medicacionHabitual?: string;
  examenFisicoHabito?: string;
  examenFisicoPeso?: number;
  examenFisicoTalla?: number;
  examenFisicoIMC?: number;
  examenFisicoTA?: string;
  examenFisicoFC?: string;
  examenFisicoFR?: string;
  examenFisicoTemperatura?: string;
  examenFisicoSistemaNervioso?: string;
  examenFisicoAPCardiovascular?: string;
  examenFisicoAPRespiratorio?: string;
  examenFisicoAPDigestivo?: string;
  examenFisicoAPGenitourinario?: string;
  examenFisicoSistemaEndocrino?: string;
  examenFisicoSistemaHematopoyetico?: string;
  examenFisicoSistemaMusculoEsqueletico?: string;
  examenFisicoPielAnexos?: string;
  primerObservacion?: string;
  laboratorios?: string;
  imagen?: string;
  imagen2?: string;
  activo?: boolean;
}

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

  @Column({ type: 'text', nullable: true })
  antecedentesPersonalesMedicos?: string;

  @Column({ type: 'text', nullable: true })
  antecedentesQuirurgicos?: string;

  @Column({ type: 'text', nullable: true })
  alergias?: string;

  @Column({ type: 'text', nullable: true })
  antecedentesHeredoFamiliares?: string;

  @Column({ type: 'text', nullable: true })
  antecedentesGinecoObstetricos?: string;

  @Column({ type: 'text', nullable: true })
  habitosToxicos?: string;

  @Column({ type: 'text', nullable: true })
  medicacionHabitual?: string;

  @Column({ nullable: true })
  examenFisicoHabito?: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  examenFisicoPeso?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  examenFisicoTalla?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  examenFisicoIMC?: number;

  @Column({ nullable: true })
  examenFisicoTA?: string;

  @Column({ nullable: true })
  examenFisicoFC?: string;

  @Column({ nullable: true })
  examenFisicoFR?: string;

  @Column({ nullable: true })
  examenFisicoTemperatura?: string;

  @Column({ type: 'text', nullable: true })
  examenFisicoSistemaNervioso?: string;

  @Column({ type: 'text', nullable: true })
  examenFisicoAPCardiovascular?: string;

  @Column({ type: 'text', nullable: true })
  examenFisicoAPRespiratorio?: string;

  @Column({ type: 'text', nullable: true })
  examenFisicoAPDigestivo?: string;

  @Column({ type: 'text', nullable: true })
  examenFisicoAPGenitourinario?: string;

  @Column({ type: 'text', nullable: true })
  examenFisicoSistemaEndocrino?: string;

  @Column({ type: 'text', nullable: true })
  examenFisicoSistemaHematopoyetico?: string;

  @Column({ type: 'text', nullable: true })
  examenFisicoSistemaMusculoEsqueletico?: string;

  @Column({ type: 'text', nullable: true })
  examenFisicoPielAnexos?: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  primerObservacion?: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  laboratorios?: string;

  @Column({ nullable: true })
  imagen?: string;

  @Column({ nullable: true })
  imagen2?: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  fechaHoraInicioHistoriaClinica: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  fechaActualizacion: Date;

  // RELACIÓN CON MÉDICO - NUEVA
  @ManyToOne(() => Medico, medico => medico.pacientes, { 
    nullable: false,
    eager: false 
  })
  @JoinColumn({ name: 'id_medico' })
  medico: Medico;

  @Column()
  id_medico: number; // Foreign key

  @OneToMany(() => Consulta, consulta => consulta.paciente, { 
    cascade: true,
    eager: false 
  })
  consultas: Consulta[];

  @OneToMany(() => Imagen, (imagen) => imagen.paciente, { cascade: true })
  imagenes: Imagen[];

  // Constructor
  constructor(datos?: Partial<DatosPaciente>) {
    if (datos) {
      Object.assign(this, datos);
    }
  }

  // Métodos de utilidad
  get nombreCompleto(): string {
    return `${this.nombre || ''} ${this.apellido || ''}`.trim();
  }

  get telefonoPreferido(): string {
    return this.telefonoCelular || this.telefonoFijo || '';
  }

  // Método para calcular IMC automáticamente
  calcularIMC(): number | null {
    if (this.examenFisicoPeso && this.examenFisicoTalla) {
      const tallaEnMetros = this.examenFisicoTalla / 100;
      const imc = this.examenFisicoPeso / (tallaEnMetros * tallaEnMetros);
      this.examenFisicoIMC = Math.round(imc * 100) / 100;
      return this.examenFisicoIMC;
    }
    return null;
  }

  // Método para validar datos básicos
  validarDatosBasicos(): boolean {
    return !!(this.nombre && this.apellido && this.dni);
  }

  // Método para obtener edad calculada
  get edadCalculada(): number | null {
    if (this.fechaNacimiento) {
      const hoy = new Date();
      const nacimiento = new Date(this.fechaNacimiento);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();
      
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      
      return edad;
    }
    return this.edad || null;
  }

  // Método para desactivar paciente (soft delete)
  desactivar(): void {
    this.activo = false;
  }

  // Método para reactivar paciente
  reactivar(): void {
    this.activo = true;
  }

  // Obtener última consulta
  get ultimaConsulta(): Date | null {
    if (!this.consultas || this.consultas.length === 0) return null;
    
    const fechas = this.consultas.map(c => new Date(c.fechaConsulta));
    return new Date(Math.max(...fechas.map(f => f.getTime())));
  }
}