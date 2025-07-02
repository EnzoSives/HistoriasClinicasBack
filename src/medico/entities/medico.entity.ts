// src/entities/medico.entity.ts (ACTUALIZADA para relación con User)
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Consulta } from 'src/consulta/entities/consulta.entity';
import { User } from 'src/users/entities/user.entity';
import { Paciente } from 'src/paciente/entities/paciente.entity';

export interface DatosMedico {
    nombre?: string;
    apellido?: string;
    dni?: string;
    telefono?: string;
    especialidad?: string;
    matricula?: string;
    colegioMedico?: string;
    direccionConsultorio?: string;
    telefonoConsultorio?: string;
    horarioAtencion?: string;
    obrasSocialesAcepta?: string;
    biografia?: string;
    foto?: string;
    activo?: boolean;
}

@Entity()
export class Medico {
    @PrimaryGeneratedColumn()
    id_medico: number;

    @Column()
    nombre: string;

    @Column()
    apellido: string;

    @Column({ unique: true })
    dni: string;

    @Column({ nullable: true })
    telefono?: string;

    @Column()
    especialidad: string;

    @Column({ unique: true })
    matricula: string;

    @Column({ nullable: true })
    colegioMedico?: string;

    @Column({ nullable: true })
    direccionConsultorio?: string;

    @Column({ nullable: true })
    telefonoConsultorio?: string;

    @Column({ type: 'text', nullable: true })
    horarioAtencion?: string;

    @Column({ type: 'text', nullable: true })
    obrasSocialesAcepta?: string;

    @Column({ type: 'text', nullable: true })
    biografia?: string;

    @Column({ nullable: true })
    foto?: string;

    @Column({ default: true })
    activo: boolean;

    @CreateDateColumn()
    fechaRegistro: Date;

    @UpdateDateColumn()
    fechaActualizacion: Date;

    // Relación OneToOne con User
    @OneToOne(() => User, user => user.medico, { 
        nullable: false 
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: number; // Foreign key

    // Relaciones con Pacientes y Consultas
    @OneToMany(() => Paciente, paciente => paciente.medico, { 
        cascade: true,
        eager: false 
    })
    pacientes: Paciente[];

    @OneToMany(() => Consulta, consulta => consulta.medico, { 
        cascade: true,
        eager: false 
    })
    consultas: Consulta[];

   

    // Métodos de utilidad
    get nombreCompleto(): string {
        return `${this.nombre} ${this.apellido}`;
    }

    get email(): string {
        return this.user?.email || '';
    }

    get username(): string {
        return this.user?.username || '';
    }

    get iniciales(): string {
        return `${this.nombre[0]}${this.apellido[0]}`.toUpperCase();
    }

    get resumenPacientes(): { total: number, activos: number } {
        const total = this.pacientes?.length || 0;
        const activos = this.pacientes?.filter(p => p.activo)?.length || 0;
        return { total, activos };
    }

    validarDatosMinimos(): boolean {
        return !!(this.nombre && this.apellido && this.dni && this.especialidad && this.matricula);
    }
}