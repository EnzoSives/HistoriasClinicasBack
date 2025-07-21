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
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) { }

  
  //  @UseGuards(AuthGuard) // Mantener el guardia para proteger el endpoint
  @Post('crear')
  @UseInterceptors(FilesInterceptor('files', 2)) 
  addDato(
    @Body() paciente: PacienteDto, // El id_medico ahora vendrá aquí
    @UploadedFiles() files: Express.Multer.File[], 
    @Request() req, // Mantener si el JWT o la autenticación se usan para otras validaciones
  ): Promise<Paciente> {
    // CAMBIO AQUÍ: Obtener id_medico directamente del cuerpo de la solicitud
    const id_medico = paciente.id_medico; // <--- MODIFICACIÓN CLAVE
    
    // Asegurarse de que id_medico esté presente y sea un número válido
    if (typeof id_medico === 'undefined' || id_medico === null) {
      throw new HttpException('id_medico es requerido en el cuerpo de la solicitud', HttpStatus.BAD_REQUEST);
    }

    const imagen1 = files && files[0] ? files[0].filename : 'Sin Imagen';
    const imagen2 = files && files[1] ? files[1].filename : 'Sin Imagen';

    return this.pacienteService.addPacientes(paciente, imagen1, imagen2, id_medico);
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
