import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { PacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Paciente } from './entities/paciente.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'; // Importa Express

@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) { }

  @Post('crear')
  @UseInterceptors(FileInterceptor('file')) // Añadir interceptor para manejo de archivos
  addDato(
    @Body() paciente: PacienteDto,
    @UploadedFile() file: Express.Multer.File, // Recibir el archivo cargado
  ): Promise<Paciente> {
    return this.pacienteService.addPacientes(paciente, file.filename, file.filename);
  }

  @Get('all')
  async getPacientes(): Promise<Paciente[]> {
    return this.pacienteService.getAll();
  }

  @Get(':id')
  async getId(@Param('id') id: number): Promise<Paciente> {
    return this.pacienteService.getId(id);
  }

  @Patch('actualizar/:id')
  updateDatoId(
    @Param('id') id: number,
    @Body() paciente: PacienteDto,
  ): Promise<Paciente> {
    return this.pacienteService.updatePacienteId(id, paciente);
  }

  @Delete('eliminar/:id')
  deleteDato(@Param('id') id: number): Promise<boolean> {
    return this.pacienteService.deletePaciente(id);
  }
}
