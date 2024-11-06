import { Module } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { ConsultaController } from './consulta.controller';
import { Consulta } from './entities/consulta.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Paciente } from 'src/paciente/entities/paciente.entity';
import { PdfService } from 'src/pdf/pdf.service';
import { PacienteService } from 'src/paciente/paciente.service';

@Module({
  imports:[TypeOrmModule.forFeature([Consulta, Paciente])],
  controllers: [ConsultaController],
  providers: [ConsultaService, PdfService, PacienteService],
})
export class ConsultaModule {}
