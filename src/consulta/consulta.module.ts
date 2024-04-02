import { Module } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { ConsultaController } from './consulta.controller';
import { Consulta } from './entities/consulta.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Paciente } from 'src/paciente/entities/paciente.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Consulta, Paciente])],
  controllers: [ConsultaController],
  providers: [ConsultaService],
})
export class ConsultaModule {}
