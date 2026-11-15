// src/horario-medico/horario-medico.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioMedico } from './entities/horario-medico.entity';
import { AuthModule } from 'src/auth/auth.module';
import { HorarioMedicoService } from './horario-medico.service';
import { HorarioMedicoController } from './horario-medico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HorarioMedico]), AuthModule],
  controllers: [HorarioMedicoController],
  providers: [HorarioMedicoService],
  exports: [TypeOrmModule],
})
export class HorarioMedicoModule {}
