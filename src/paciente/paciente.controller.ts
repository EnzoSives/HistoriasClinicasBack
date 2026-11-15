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
  UseGuards,
  Request,
} from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { PacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Paciente } from './entities/paciente.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../config/multer.config'; // Asegúrate que la ruta a tu configuración de multer sea correcta
import { AuthGuard } from 'src/auth/auth.guard';

// Interfaz para dar un tipado claro a los archivos que se reciben
interface UploadedPatientFiles {
  imagen?: Express.Multer.File[];
  imagen2?: Express.Multer.File[];
}

@Controller('paciente')
@UseGuards(AuthGuard)
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
    @Request() req: any,
  ): Promise<Paciente> {
    const id_medico = req.user.id_medico;
    if (!id_medico) {
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
    return this.pacienteService.crearPacienteConImagenes({ ...pacienteDto, id_medico }, allFiles);
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
    @Request() req: any,
  ): Promise<Paciente> {

    const allFiles: Express.Multer.File[] = [
      ...(files?.imagen ?? []),
      ...(files?.imagen2 ?? []),
    ];
    return this.pacienteService.actualizarPacienteConImagenes(
      id,
      updatePacienteDto,
      allFiles,
      req.user.id_medico,
    );
  }

  @Get('all')
  async getPacientes(@Request() req: any): Promise<Paciente[]> {
    return this.pacienteService.getPacientesByMedicoId(req.user.id_medico);
  }

  @Get(':id')
  async getId(@Param('id', ParseIntPipe) id: number, @Request() req: any): Promise<Paciente> {
    return this.pacienteService.getId(id, req.user.id_medico);
  }

  @Get('medico/:id_medico')
  async getPacientesPorMedico(
    @Param('id_medico', ParseIntPipe) id_medico: number,
    @Request() req: any,
  ): Promise<Paciente[]> {
    return this.pacienteService.getPacientesByMedicoId(req.user.id_medico);
  }

  @Delete('eliminar/:id')
  deleteDato(@Param('id', ParseIntPipe) id: number, @Request() req: any): Promise<boolean> {
    return this.pacienteService.deletePaciente(id, req.user.id_medico);
  }
}
