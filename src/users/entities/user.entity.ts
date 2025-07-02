// src/entities/user.entity.ts (MEJORADA)
import { IsEnum } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, OneToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Medico } from 'src/medico/entities/medico.entity';
import { Role } from "src/common/enum/rol.enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ unique: true })
    email: string;

    @IsEnum(Role)
    @Column({
        type: "enum",
        enum: Role,
        default: Role.MEDICO // Asumiendo que Role.MEDICO existe
    })
    role: Role;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    lastLogin?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deleteAt?: Date;

    // Relación OneToOne con Medico
    @OneToOne(() => Medico, medico => medico.user, { 
        cascade: true,
        eager: false 
    })
    medico?: Medico;


    // Métodos de utilidad
    updateLastLogin(): void {
        this.lastLogin = new Date();
    }

    deactivate(): void {
        this.isActive = false;
    }

    activate(): void {
        this.isActive = true;
    }
}