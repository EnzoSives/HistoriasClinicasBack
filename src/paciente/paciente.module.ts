import { Module } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { PacienteController } from './paciente.controller';
import { Paciente } from './entities/paciente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Paciente])],
  controllers: [PacienteController],
  providers: [PacienteService],
})
export class PacienteModule {}
