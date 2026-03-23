import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Imagen } from '../imagen/entities/imagen.entity';
import { Medico } from 'src/medico/entities/medico.entity';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
    @InjectRepository(Medico) // <-- 2. INYECTA EL REPOSITORIO DE MEDICO
    private readonly medicoRepository: Repository<Medico>,
  ) {}

  /**
   * Crea un nuevo paciente y asocia las imágenes subidas.
   * @param pacienteDto - Datos para crear el paciente.
   * @param files - Array de archivos de imagen subidos.
   */
 public async crearPacienteConImagenes(
    pacienteDto: PacienteDto,
    files: Express.Multer.File[],
  ): Promise<Paciente> {
    try {
      // --- 3. AÑADE LA VALIDACIÓN ---
      if (!pacienteDto.id_medico) {
        throw new BadRequestException('El id_medico es requerido.');
      }
      
      const medico = await this.medicoRepository.findOne({ where: { id_medico: pacienteDto.id_medico } });
      if (!medico) {
        throw new NotFoundException(`El médico con ID ${pacienteDto.id_medico} no existe.`);
      }
      // --- FIN DE LA VALIDACIÓN ---

      // Separa la fecha del resto de los datos para manejarla correctamente.
      const { fechaNacimiento, ...restOfDto } = pacienteDto;
      const paciente = this.pacienteRepository.create(restOfDto);

      // --- CORRECCIÓN DE FECHA ---
      // Si se proporciona una fecha de nacimiento, la convierte a un objeto Date.
      // TypeORM se encargará de formatearla correctamente para la base de datos.
      if (fechaNacimiento) {
        paciente.fechaNacimiento = new Date(fechaNacimiento);
        if (isNaN(paciente.fechaNacimiento.getTime())) {
          throw new Error('Formato de fecha de nacimiento inválido.');
        }
      }

      if (files && files.length > 0) {
        paciente.imagenes = files.map((file) => {
          const imagen = new Imagen();
          imagen.filename = file.filename;
          imagen.path = file.path;
          return imagen;
        });
      }

      return await this.pacienteRepository.save(paciente);
    } catch (error) {
      // Mejora del manejo de errores para devolver excepciones específicas
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Ocurrió un error al crear el paciente: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Actualiza un paciente existente y le añade nuevas imágenes.
   * @param id - ID del paciente a actualizar.
   * @param updatePacienteDto - Datos a actualizar.
   * @param files - Nuevos archivos de imagen para agregar.
   */
  public async actualizarPacienteConImagenes(
    id: number,
    updatePacienteDto: UpdatePacienteDto,
    files: Express.Multer.File[],
  ): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOne({
      where: { id_paciente: id },
      relations: ['imagenes'],
    });

    if (!paciente) {
      throw new NotFoundException(`No se encontró el paciente con id: ${id}`);
    }

    // Separa la fecha para manejarla antes de asignar el resto de los datos.
    const { fechaNacimiento, ...restOfDto } = updatePacienteDto;
    Object.assign(paciente, restOfDto);

    // --- CORRECCIÓN DE FECHA EN UPDATE ---
    if (fechaNacimiento) {
      paciente.fechaNacimiento = new Date(fechaNacimiento);
      if (isNaN(paciente.fechaNacimiento.getTime())) {
        throw new Error('Formato de fecha de nacimiento inválido.');
      }
    }

    if (files && files.length > 0) {
      const nuevasImagenes = files.map((file) => {
        const imagen = new Imagen();
        imagen.filename = file.filename;
        imagen.path = file.path;
        return imagen;
      });
      paciente.imagenes = [...(paciente.imagenes || []), ...nuevasImagenes];
    }

    try {
      return await this.pacienteRepository.save(paciente);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Ocurrió un error al actualizar el paciente: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getAll(): Promise<Paciente[]> {
    return await this.pacienteRepository.find({ relations: ['imagenes'] });
  }

  public async getId(id: number): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOne({
      where: { id_paciente: id },
      relations: ['imagenes', 'consultas', 'medico', 'medico.user'],
    });
    if (!paciente) {
      throw new NotFoundException(`No se encontró el paciente con id: ${id}`);
    }
    return paciente;
  }

  public async getPacientesByMedicoId(id_medico: number): Promise<Paciente[]> {
    return await this.pacienteRepository.find({
      where: { id_medico: id_medico },
      relations: ['imagenes'],
    });
  }

  public async deletePaciente(id: number): Promise<boolean> {
    try {
      const result = await this.pacienteRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`No se encontró el paciente con id: ${id} para eliminar.`);
      }
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Ocurrió un error al eliminar el paciente: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
