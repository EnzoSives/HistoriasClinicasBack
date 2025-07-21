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
  HttpException,
  HttpStatus,
  Request,
  ParseIntPipe
} from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { PacienteDto } from './dto/create-paciente.dto';

import { Paciente } from './entities/paciente.entity';
import { FilesInterceptor } from '@nestjs/platform-express';


@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) { }

  @Post('crear')
  @UseInterceptors(FilesInterceptor('files', 2)) // Añadir interceptor para manejo de múltiples archivos
  addDato(
    @Body() paciente: PacienteDto,
    @UploadedFiles() files: Express.Multer.File[], // Recibir los archivos cargados
  ): Promise<Paciente> {
    // Si no se reciben archivos o se recibe un número menor de los esperados, asignar "Sin Imagen"
    const imagen1 = files[0]?.filename || 'Sin Imagen';
    const imagen2 = files[1]?.filename || 'Sin Imagen';
  
    return this.pacienteService.addPacientes(paciente, imagen1, imagen2);
  }
  

  @Get('all')
  async getPacientes(): Promise<Paciente[]> {
    return this.pacienteService.getAll();
  }

  @Get(':id')
  async getId(@Param('id') id: number): Promise<Paciente> {
    return this.pacienteService.getId(id);
  }

  // NUEVO ENDPOINT
  // @UseGuards(AuthGuard)
   // ENDPOINT MODIFICADO
  @Get('medico/:id_medico')
  async getPacientesPorMedico(
    @Param('id_medico', ParseIntPipe) id_medico: number
  ): Promise<Paciente[]> {
    // Ya no se necesita el AuthGuard para obtener el id,
    // pero puedes mantenerlo si quieres que la ruta siga siendo protegida.
    return this.pacienteService.getPacientesByMedicoId(id_medico);
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
