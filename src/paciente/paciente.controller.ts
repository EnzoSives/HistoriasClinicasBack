import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import {  PacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Paciente } from './entities/paciente.entity';

@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Post('crear')
  addDato(@Body() paciente:PacienteDto ) : Promise<Paciente>{
      return this.pacienteService.addPacientes(paciente);
  }

  @Get('all')
  async getPacientes(): Promise<Paciente[]>{
    return this.pacienteService.getAll();
  }

  @Get(':id')
  async getId(@Param('id') id:number) : Promise<Paciente>{
    return this.pacienteService.getId(id)
  }

  @Patch('actualizar/:id')
  updateDatoId(@Param('id')id:number, @Body() paciente: PacienteDto) : Promise<Paciente>{
    return this.pacienteService.updatePacienteId(id,paciente);
  }

  @Delete('eliminar/:id')
  deleteDato(@Param('id') id : number) : Promise<boolean> {
    return this.pacienteService.deletePaciente(id);
  }
}
