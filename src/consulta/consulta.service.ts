import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Consulta } from './entities/consulta.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Paciente } from 'src/paciente/entities/paciente.entity';

@Injectable()
export class ConsultaService {
  constructor(@InjectRepository(Consulta)private consultaRepository: Repository<Consulta>,
  @InjectRepository(Paciente) private pacienteRepository){}

  public async getAll():Promise<Consulta[]>{
    return await this.consultaRepository.find();
  }

  public async getId(id:number) : Promise<Consulta>{
    try{
      const criterio : FindOneOptions =  { where: {id:id} }
      let consulta : Consulta = await this.consultaRepository.findOne( criterio );
      if(consulta)
        return consulta;
      else
        throw new Error(`No se encontro ciudad con id: ${id}`);
    }
    catch(error){
      throw new HttpException(
        {status: HttpStatus.NOT_FOUND,error:`500 - ERROR: ` +error},
        HttpStatus.NOT_FOUND
      )
    }
  }

  public async addConsulta(consultaDto: ConsultaDto): Promise<Consulta> {
    try {
      let consulta: Consulta = await this.consultaRepository.save(
        new Consulta(consultaDto.fechaHoraInicio, consultaDto.motivoConsulta, consultaDto.observaciones)
      );
  
      // Asegúrate de que la propiedad `id_paciente` esté presente en tu DTO
      const pacienteId = consultaDto.id_paciente;
  
      if (pacienteId) {
        consulta.paciente = await this.pacienteRepository.findOne(pacienteId);
      } else {
        throw new Error(`El ID del paciente no está presente en el DTO de la consulta`);
      }
  
      if (consulta) {
        return consulta;
      } else {
        throw new Error(`No se pudo agregar los datos`);
      }
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: `500 - ERROR: ` + error },
        HttpStatus.NOT_FOUND
      );
    }
  }
  
  public async updateConsultaId(id: number, consultaDto: Partial<ConsultaDto>): Promise<Consulta> {
    try {
      const criterio: FindOneOptions = { where: { id: id } };
      let consulta: Consulta = await this.consultaRepository.findOne(criterio);
      
      if (consulta) {
        // Actualizar solo los campos proporcionados en datoDto
        Object.assign(consulta, consultaDto);
  
        consulta = await this.consultaRepository.save(consulta);
        return consulta;
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
  
  public async deleteconsulta(id : number) : Promise<boolean> {
    try {
       let criterio : FindOneOptions = { where: {id: id} };
       let consulta : Consulta = await this.consultaRepository.findOne(criterio);
       if (!consulta)
       throw new Error(`No se pudo actualizar eliminar`)
       else
          await this.consultaRepository.delete(id);
       return true;
    } catch(error){
      throw new HttpException(
        {status: HttpStatus.NOT_FOUND,error:`500 - ERROR: ` +error},
        HttpStatus.NOT_FOUND
      )
    }
  }
  public async getConsultasByPacienteId(idPaciente: number): Promise<Consulta[]> {
    try {
      const criterio: FindManyOptions = { where: { paciente: { id_paciente: idPaciente } } };
      let consultas: Consulta[] = await this.consultaRepository.find(criterio);
      if (consultas.length > 0) {
        return consultas;
      } else {
        throw new Error(`No se encontraron consultas para el paciente con id: ${idPaciente}`);
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: `500 - ERROR: ` + error },
        HttpStatus.NOT_FOUND
      );
    }
  }
  
  
  }
  


