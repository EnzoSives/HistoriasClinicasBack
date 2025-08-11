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
  ParseIntPipe,
} from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { PacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Paciente } from './entities/paciente.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../config/multer.config'; // Asumiendo que creaste este archivo

@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  /**
   * Endpoint para crear un nuevo paciente con imágenes.
   * Utiliza FilesInterceptor para manejar múltiples archivos.
   * @param pacienteDto - Datos del paciente.
   * @param files - Array de archivos de imagen subidos.
   */
  @Post('crear')
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions)) // Permite hasta 10 archivos
  crearPaciente(
    @Body() pacienteDto: PacienteDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Paciente> {
    // La validación del id_medico ahora se puede hacer en el DTO o en el servicio.
    if (!pacienteDto.id_medico) {
      throw new HttpException(
        'El id_medico es requerido en el cuerpo de la solicitud',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Llama al nuevo método del servicio que maneja la lógica de creación
    // y la asociación de las imágenes.
    return this.pacienteService.crearPacienteConImagenes(pacienteDto, files);
  }

  /**
   * Endpoint para actualizar un paciente existente, permitiendo también la subida de nuevas imágenes.
   * @param id - ID del paciente a actualizar.
   * @param updatePacienteDto - Datos a actualizar del paciente.
   * @param files - Nuevas imágenes para agregar al paciente.
   */
  @Patch('actualizar/:id')
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  actualizarPaciente(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePacienteDto: UpdatePacienteDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Paciente> {
    return this.pacienteService.actualizarPacienteConImagenes(id, updatePacienteDto, files);
  }


  @Get('all')
  async getPacientes(): Promise<Paciente[]> {
    return this.pacienteService.getAll();
  }

  @Get(':id')
  async getId(@Param('id', ParseIntPipe) id: number): Promise<Paciente> {
    return this.pacienteService.getId(id);
  }

  @Get('medico/:id_medico')
  async getPacientesPorMedico(
    @Param('id_medico', ParseIntPipe) id_medico: number,
  ): Promise<Paciente[]> {
    return this.pacienteService.getPacientesByMedicoId(id_medico);
  }

  @Delete('eliminar/:id')
  deleteDato(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.pacienteService.deletePaciente(id);
  }
}
