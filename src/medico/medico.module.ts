import { Module } from '@nestjs/common';
import { MedicoService } from './medico.service';
import { MedicoController } from './medico.controller';
import { Medico } from './entities/medico.entity';
import { User } from 'src/users/entities/user.entity';
import { Paciente } from 'src/paciente/entities/paciente.entity';
import { Consulta } from 'src/consulta/entities/consulta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Medico, User, Paciente, Consulta])],
  controllers: [MedicoController],
  providers: [MedicoService],
})
export class MedicoModule {}
