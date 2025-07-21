import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PacienteService {
  constructor(@InjectRepository(Paciente) private pacienteRepository: Repository<Paciente>) { }


  public async getAll(): Promise<Paciente[]> {
    return await this.pacienteRepository.find();
  }

  public async getId(id: number): Promise<Paciente> {
    try {
      const criterio: FindOneOptions = { where: { id_paciente: id } }
      let paciente: Paciente = await this.pacienteRepository.findOne(criterio);
      if (paciente)
        return paciente;
      else
        throw new Error(`No se encontro ciudad con id: ${id}`);
    }
    catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: `500 - ERROR: ` + error },
        HttpStatus.NOT_FOUND
      )
    }
  }

   // NUEVO MÉTODO
  public async getPacientesByMedicoId(id_medico: number): Promise<Paciente[]> {
    try {
      const pacientes: Paciente[] = await this.pacienteRepository.find({ where: { id_medico: id_medico } });
      if (pacientes.length > 0) {
        return pacientes;
      } else {
        return [];
      }
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: `500 - ERROR: ` + error },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
  
  public async addPacientes(pacienteDto: PacienteDto, imagePath: string, imagePath2: string): Promise<Paciente> {
    try {
      let paciente: Paciente = new Paciente();
      Object.assign(paciente, pacienteDto);

      paciente.imagen = imagePath;
      paciente.imagen2 = imagePath2;

      paciente = await this.pacienteRepository.save(paciente);
      if (paciente) return paciente;
      else throw new Error(`No se pudo agregar los datos`);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: `500 - ERROR: ` + error },
        HttpStatus.NOT_FOUND,
      );
    }
  }


  public async updatePacienteId(id: number, pacienteDto: Partial<PacienteDto>): Promise<Paciente> {
    try {
      const criterio: FindOneOptions = { where: { id_paciente: id } };
      let paciente: Paciente = await this.pacienteRepository.findOne(criterio);

      if (paciente) {
        // Actualizar solo los campos proporcionados en datoDto
        Object.assign(paciente, pacienteDto);

        paciente = await this.pacienteRepository.save(paciente);
        return paciente;
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

  public async deletePaciente(id: number): Promise<boolean> {
    try {
      let criterio: FindOneOptions = { where: { id_paciente: id } };
      let paciente: Paciente = await this.pacienteRepository.findOne(criterio);
      if (!paciente)
        throw new Error(`No se pudo actualizar eliminar`)
      else
        await this.pacienteRepository.delete(id);
      return true;
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: `500 - ERROR: ` + error },
        HttpStatus.NOT_FOUND
      )
    }
  }
}
