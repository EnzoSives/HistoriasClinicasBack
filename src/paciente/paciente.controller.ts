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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../config/multer.config'; // Asegúrate que la ruta a tu configuración de multer sea correcta

// Interfaz para dar un tipado claro a los archivos que se reciben
interface UploadedPatientFiles {
  imagen?: Express.Multer.File[];
  imagen2?: Express.Multer.File[];
}

@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  /**
   * Endpoint para crear un nuevo paciente con imágenes.
   * Utiliza FileFieldsInterceptor para manejar los campos de archivo 'imagen' e 'imagen2'.
   * @param pacienteDto - Datos del paciente.
   * @param files - Objeto con los archivos de imagen subidos.
   */
  @Post('crear')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'imagen', maxCount: 1 },
        { name: 'imagen2', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  crearPaciente(
    @Body() pacienteDto: PacienteDto,
    @UploadedFiles() files: UploadedPatientFiles,
  ): Promise<Paciente> {
    if (!pacienteDto.id_medico) {
      throw new HttpException(
        'El id_medico es requerido en el cuerpo de la solicitud',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Combina los archivos de imagen en un solo array antes de pasarlos al servicio
    const allFiles: Express.Multer.File[] = [
      ...(files?.imagen ?? []),
      ...(files?.imagen2 ?? []),
    ];
    return this.pacienteService.crearPacienteConImagenes(pacienteDto, allFiles);
  }

  /**
   * Endpoint para actualizar un paciente existente, permitiendo también la subida de nuevas imágenes.
   * @param id - ID del paciente a actualizar.
   * @param updatePacienteDto - Datos a actualizar del paciente.
   * @param files - Nuevas imágenes para agregar o reemplazar.
   */
  @Patch('actualizar/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'imagen', maxCount: 1 },
        { name: 'imagen2', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  actualizarPaciente(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePacienteDto: UpdatePacienteDto,
    @UploadedFiles() files: UploadedPatientFiles,
  ): Promise<Paciente> {

      const allFiles: Express.Multer.File[] = [
      ...(files.imagen ?? []),
      ...(files.imagen2 ?? []),
    ];
    return this.pacienteService.actualizarPacienteConImagenes(
      id,
      updatePacienteDto,
      allFiles,
    );
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