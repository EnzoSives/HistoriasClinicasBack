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
  UseGuards,
  Request
} from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { PacienteDto } from './dto/create-paciente.dto';

import { Paciente } from './entities/paciente.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) { }

   @UseGuards(AuthGuard) // Protege el endpoint
  @Post('crear')
  @UseInterceptors(FilesInterceptor('files', 2)) 
  addDato(
    @Body() paciente: PacienteDto,
    @UploadedFiles() files: Express.Multer.File[], 
    @Request() req,// Obtiene el objeto de solicitud
  ): Promise<Paciente> {
    const id_medico = req.user.id_medico; // Extrae el id del médico
    const imagen1 = files && files[0] ? files[0].filename : 'Sin Imagen';
    const imagen2 = files && files[1] ? files[1].filename : 'Sin Imagen';

    return this.pacienteService.addPacientes(paciente, imagen1, imagen2, id_medico); // Pasa el id_medico al servicio
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
