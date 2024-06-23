import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { PacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Paciente } from './entities/paciente.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'; // Importa Express

@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) { }

  @Post('crear')
  @UseInterceptors(FilesInterceptor('files', 2)) // Añadir interceptor para manejo de múltiples archivos
  addDato(
    @Body() paciente: PacienteDto,
    @UploadedFiles() files: Express.Multer.File[], // Recibir los archivos cargados
  ): Promise<Paciente> {
    // Asegúrate de que se recibieron exactamente dos archivos
    if (files.length !== 2) {
      throw new Error('Se requieren exactamente dos archivos.');
    }

    return this.pacienteService.addPacientes(paciente, files[0].filename, files[1].filename);
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
