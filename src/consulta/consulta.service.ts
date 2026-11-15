import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Consulta } from './entities/consulta.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Paciente } from 'src/paciente/entities/paciente.entity';
import { Imagen } from 'src/imagen/entities/imagen.entity';

@Injectable()
export class ConsultaService {
  constructor(
    @InjectRepository(Consulta) private consultaRepository: Repository<Consulta>,
    @InjectRepository(Paciente) private pacienteRepository: Repository<Paciente>
  ) { }

  public async getAll(): Promise<Consulta[]> {
    return await this.consultaRepository.find({ relations: ['imagenes'] });
  }

  public async getId(id: number, id_medico?: number): Promise<Consulta> {
    try {
      const criterio: FindOneOptions<Consulta> = { 
        where: { id_consulta: id, ...(id_medico ? { id_medico } : {}) },
        relations: ['imagenes'] // Cargar imágenes
      };
      const consulta: Consulta = await this.consultaRepository.findOne(criterio);
      if (consulta) {
        return consulta;
      } else {
        throw new Error(`No se encontró consulta con id: ${id}`);
      }
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: `500 - ERROR: ` + error },
        HttpStatus.NOT_FOUND
      );
    }
  }

 public async crearConsultaConImagenes(consultaDto: ConsultaDto, files: Express.Multer.File[], id_medico: number): Promise<Consulta> {
    try {
        const paciente = await this.pacienteRepository.findOne({ where: { id_paciente: consultaDto.id_paciente, id_medico } });
        if (!paciente) {
            throw new NotFoundException(`El paciente con id: ${consultaDto.id_paciente} no existe.`);
        }

        const nuevaConsulta = this.consultaRepository.create({
          ...consultaDto,
          paciente: paciente,
          id_medico: id_medico,
        });

        if (files && files.length > 0) {
          nuevaConsulta.imagenes = files.map(file => {
            const imagen = new Imagen();
            imagen.filename = file.filename;
            imagen.path = file.path;
            return imagen;
          });
        }
        
        return await this.consultaRepository.save(nuevaConsulta);

    } catch (error) {
        if (error instanceof NotFoundException) {
            throw error;
        }
        throw new HttpException(
            { status: HttpStatus.INTERNAL_SERVER_ERROR, error: `Error al crear la consulta: ${error.message}` },
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }

  public async updateConsultaId(
    id: number,
    consultaDto: Partial<ConsultaDto>,
    id_medico?: number,
    files?: Express.Multer.File[],
  ): Promise<Consulta> {
    try {
      const criterio: FindOneOptions<Consulta> = {
        where: { id_consulta: id, ...(id_medico ? { id_medico } : {}) },
        relations: ['imagenes'],
      };
      let consulta: Consulta = await this.consultaRepository.findOne(criterio);

      if (consulta) {
        const { id_medico: _ignoredMedico, id_paciente: _ignoredPaciente, ...safeData } = consultaDto;
        Object.assign(consulta, safeData);
        if (files?.length) {
          const nuevasImagenes = files.map(file => {
            const imagen = new Imagen();
            imagen.filename = file.filename;
            imagen.path = file.path;
            return imagen;
          });
          consulta.imagenes = [...(consulta.imagenes || []), ...nuevasImagenes];
        }

        return await this.consultaRepository.save(consulta);
      } else {
        throw new Error(`No se pudo actualizar el id: ${id}`);
      }
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: `500 - ERROR: ` + error },
        HttpStatus.NOT_FOUND
      );
    }
  }

  public async deleteconsulta(id: number, id_medico?: number): Promise<boolean> {
    try {
      const criterio: FindOneOptions<Consulta> = { where: { id_consulta: id, ...(id_medico ? { id_medico } : {}) } };
      let consulta: Consulta = await this.consultaRepository.findOne(criterio);

      if (!consulta) {
        throw new Error(`No se pudo eliminar la consulta con id: ${id}`);
      } else {
        await this.consultaRepository.delete({ id_consulta: id, ...(id_medico ? { id_medico } : {}) });
        return true;
      }
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: `500 - ERROR: ` + error },
        HttpStatus.NOT_FOUND
      );
    }
  }

  public async getConsultasByPacienteId(idPaciente: number, id_medico?: number): Promise<Consulta[]> {
    const paciente = await this.pacienteRepository.findOne({
      where: { id_paciente: idPaciente, ...(id_medico ? { id_medico } : {}) },
    });
    if (!paciente) throw new NotFoundException('Paciente no encontrado.');
    try {
      const criterio: FindManyOptions<Consulta> = { 
        where: { paciente: { id_paciente: idPaciente }, ...(id_medico ? { id_medico } : {}) },
        relations: ['imagenes'] // Cargar imágenes
      };
      let consultas: Consulta[] = await this.consultaRepository.find(criterio);

      return consultas;
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: `500 - ERROR: ` + error },
        HttpStatus.NOT_FOUND
      );
    }
  }

  public async getConsultasByMedicoId(idMedico: number): Promise<Consulta[]> {
    try {
      const criterio: FindManyOptions<Consulta> = { 
        where: { id_medico: idMedico },
        relations: ['imagenes'] // Cargar imágenes
      };
      const consultas: Consulta[] = await this.consultaRepository.find(criterio);

      return consultas;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: `Error al obtener las consultas: ${error.message}` },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
