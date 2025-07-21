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
  
   public async addPacientes(pacienteDto: PacienteDto, imagePath: string, imagePath2: string, id_medico: number): Promise<Paciente> {
    try {
      let paciente: Paciente = new Paciente();
      Object.assign(paciente, pacienteDto);

      // --- INICIO DE LA MODIFICACIÓN CLAVE PARA FECHA ---
      if (pacienteDto.fechaNacimiento) {
        const parsedDate = new Date(pacienteDto.fechaNacimiento);
        // Validar si la fecha es un objeto de fecha válido
        if (isNaN(parsedDate.getTime())) {
            throw new Error('Formato de fecha de nacimiento inválido.');
        }
        // Formatear a 'YYYY-MM-DD' para la columna DATE de MySQL
        const year = parsedDate.getFullYear();
        const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0'); // Meses son de 0-11
        const day = parsedDate.getDate().toString().padStart(2, '0');
        paciente.fechaNacimiento = `${year}-${month}-${day}` as any; // Se usa 'as any' para compatibilidad de tipo temporal
      } else {
          paciente.fechaNacimiento = undefined; // Asegurarse de que sea undefined si no se provee
      }
      // --- FIN DE LA MODIFICACIÓN CLAVE PARA FECHA ---

      paciente.imagen = imagePath;
      paciente.imagen2 = imagePath2;
      paciente.id_medico = id_medico;

      paciente = await this.pacienteRepository.save(paciente);
      if (paciente) return paciente;
      else throw new Error(`No se pudo agregar los datos`);
    } catch (error) {
      // Cambiado a INTERNAL_SERVER_ERROR ya que es un error de procesamiento del servidor
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: `500 - ERROR: ` + error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updatePacienteId(id: number, pacienteDto: Partial<PacienteDto>): Promise<Paciente> {
    try {
      const criterio: FindOneOptions = { where: { id_paciente: id } };
      let paciente: Paciente = await this.pacienteRepository.findOne(criterio);

      if (paciente) {
        Object.assign(paciente, pacienteDto);

        // --- INICIO DE LA MODIFICACIÓN CLAVE PARA FECHA EN UPDATE ---
        if (pacienteDto.fechaNacimiento) {
            const parsedDate = new Date(pacienteDto.fechaNacimiento);
            if (isNaN(parsedDate.getTime())) {
                throw new Error('Formato de fecha de nacimiento inválido.');
            }
            const year = parsedDate.getFullYear();
            const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
            const day = parsedDate.getDate().toString().padStart(2, '0');
            paciente.fechaNacimiento = `${year}-${month}-${day}` as any;
        } else if (Object.prototype.hasOwnProperty.call(pacienteDto, 'fechaNacimiento') && pacienteDto.fechaNacimiento === undefined) {
             paciente.fechaNacimiento = undefined; // Permitir borrar la fecha si se envía explícitamente undefined
        }
        // --- FIN DE LA MODIFICACIÓN CLAVE PARA FECHA EN UPDATE ---

        paciente = await this.pacienteRepository.save(paciente);
        return paciente;
      } else {
        throw new Error(`No se pudo actualizar el id: ${id}`);
      }
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: `500 - ERROR: ` + error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
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
        { status: HttpStatus.NOT_FOUND, error: `500 - ERROR: ` + error.message },
        HttpStatus.NOT_FOUND
      )
    }
  }
}
