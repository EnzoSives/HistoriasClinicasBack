import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { ConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { Consulta } from './entities/consulta.entity';

@Controller('consulta')
export class ConsultaController {
  constructor(private readonly consultaService: ConsultaService) {}


  @Post('crear')
  addDato(@Body() consulta:ConsultaDto ) : Promise<Consulta>{
      return this.consultaService.addConsulta(consulta);
  }

  @Get('all')
  async getconsultas(): Promise<Consulta[]>{
    return this.consultaService.getAll();
  }

  @Get(':id')
  async getId(@Param('id') id:number) : Promise<Consulta>{
    return this.consultaService.getId(id)
  }
  @Get('paciente/:idPaciente')
  async getConsultasByPacienteId(@Param('idPaciente', ParseIntPipe) idPaciente: number): Promise<Consulta[]> {
    // Obtiene las consultas del servicio.
    const consultas = await this.consultaService.getConsultasByPacienteId(idPaciente);
  
    // Devuelve las consultas.
    return consultas;
  }
  
  @Patch('actualizar/:id')
  updateDatoId(@Param('id')id:number, @Body() consulta: ConsultaDto) : Promise<Consulta>{
    return this.consultaService.updateConsultaId(id,consulta);
  }

  @Delete('eliminar/:id')
  deleteDato(@Param('id') id : number) : Promise<boolean> {
    return this.consultaService.deleteconsulta(id);
  }
}

