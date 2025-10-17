// src/turno/turno.module.ts
import { Module } from '@nestjs/common';
import { TurnoService } from './turno.service';
import { TurnoController } from './turno.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turno } from './entities/turno.entity';
import { Medico } from 'src/medico/entities/medico.entity';
import { Paciente } from 'src/paciente/entities/paciente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Turno, Medico, Paciente])], // <-- AÑADIR Medico y Paciente
  controllers: [TurnoController],
  providers: [TurnoService],
})
export class TurnoModule {}