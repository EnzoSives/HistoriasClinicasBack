import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Consulta } from './entities/consulta.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Paciente } from 'src/paciente/entities/paciente.entity';

@Injectable()
export class ConsultaService {
  constructor(
    @InjectRepository(Consulta) private consultaRepository: Repository<Consulta>,
    @InjectRepository(Paciente) private pacienteRepository: Repository<Paciente>
  ) { }

  public async getAll(): Promise<Consulta[]> {
    return await this.consultaRepository.find();
  }

  public async getId(id: number): Promise<Consulta> {
    try {
      const criterio: FindOneOptions<Consulta> = { where: { id_consulta: id } };
      let consulta: Consulta = await this.consultaRepository.findOne(criterio);
      if (consulta) return consulta;
      else throw new Error(`No se encontró consulta con id: ${id}`);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: `500 - ERROR: ` + error },
        HttpStatus.NOT_FOUND
      );
    }
  }

  public async addConsulta(consultaDto: ConsultaDto): Promise<Consulta> {
    try {
      const pacienteId = consultaDto.id_paciente;

      // Verificar si el paciente existe
      const paciente = await this.pacienteRepository.findOne({ where: { id_paciente: pacienteId } });
      if (!paciente) {
        throw new Error(`El paciente con id: ${pacienteId} no existe`);
      }

      // Crear una nueva instancia de Consulta y asignar los valores del DTO
      let consulta = new Consulta();
      consulta.motivoConsulta = consultaDto.motivoConsulta;
      consulta.observaciones = consultaDto.observaciones;

      // Asignar el paciente a la consulta
      consulta.paciente = paciente;

      // Guardar la consulta en la base de datos
      consulta = await this.consultaRepository.save(consulta);

      return consulta;
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: `500 - ERROR: ` + error },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async updateConsultaId(
    id: number,
    consultaDto: Partial<ConsultaDto>,
  ): Promise<Consulta> {
    try {
      const criterio: FindOneOptions<Consulta> = { where: { id_consulta: id } };
      let consulta: Consulta = await this.consultaRepository.findOne(criterio);

      if (consulta) {
        Object.assign(consulta, consultaDto);

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

  public async deleteconsulta(id: number): Promise<boolean> {
    try {
      const criterio: FindOneOptions<Consulta> = { where: { id_consulta: id } };
      let consulta: Consulta = await this.consultaRepository.findOne(criterio);

      if (!consulta) {
        throw new Error(`No se pudo eliminar la consulta con id: ${id}`);
      } else {
        await this.consultaRepository.delete(id);
        return true;
      }
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: `500 - ERROR: ` + error },
        HttpStatus.NOT_FOUND
      );
    }
  }

  public async getConsultasByPacienteId(idPaciente: number): Promise<Consulta[]> {
    try {
      const criterio: FindManyOptions<Consulta> = { where: { paciente: { id_paciente: idPaciente } } };
      let consultas: Consulta[] = await this.consultaRepository.find(criterio);

      if (consultas.length > 0) {
        return consultas;
      } else {
        throw new Error(`No se encontraron consultas para el paciente con id: ${idPaciente}`);
      }
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: `500 - ERROR: ` + error },
        HttpStatus.NOT_FOUND
      );
    }
  }
}
