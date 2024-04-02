import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PacienteService {
constructor(@InjectRepository(Paciente) private pacienteRepository: Repository<Paciente>){}


public async getAll():Promise<Paciente[]>{
  return await this.pacienteRepository.find();
}

public async getId(id:number) : Promise<Paciente>{
  try{
    const criterio : FindOneOptions =  { where: {id:id} }
    let paciente : Paciente = await this.pacienteRepository.findOne( criterio );
    if(paciente)
      return paciente;
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

public async addPacientes(pacienteDto: PacienteDto) : Promise<Paciente>{
    
  try{

    let paciente: Paciente = await this.pacienteRepository.save(new Paciente(pacienteDto.nombre,pacienteDto.apellido,pacienteDto.dni,pacienteDto.sexo,pacienteDto.edad,pacienteDto.fechaNacimiento,pacienteDto.lugarNacimiento,pacienteDto.direccion,pacienteDto.telefonoFijo,pacienteDto.telefonoCelular,pacienteDto.ocupacion,pacienteDto.estadoCivil,pacienteDto.obraSocial,pacienteDto.afiliadoObraSocial, pacienteDto.antecedentesPersonalesMedicos,pacienteDto.antecedentesQuirurgicos,pacienteDto.alergias,pacienteDto.antecedentesHeredoFamiliares,pacienteDto.habitosToxicos,pacienteDto.medicacionHabitual,pacienteDto.examenFisicoHabito,pacienteDto.examenFisicoPeso,pacienteDto.examenFisicoTalla,pacienteDto.examenFisicoIMC,pacienteDto.examenFisicoTA,pacienteDto.examenFisicoFC,pacienteDto.examenFisicoFR,pacienteDto.examenFisicoTemperatura,pacienteDto.examenFisicoSistemaNervioso,pacienteDto.examenFisicoAPCardiovascular,pacienteDto.examenFisicoAPRespiratorio,pacienteDto.examenFisicoAPDigestivo,pacienteDto.examenFisicoAPGenitourinario,pacienteDto.examenFisicoSistemaEndocrino,pacienteDto.examenFisicoSistemaHematopoyetico,pacienteDto.examenFisicoSistemaMusculoEsqueletico,pacienteDto.examenFisicoPielAnexos,))

    if(paciente)
    return paciente;
  else
  throw new Error(`No se puedo agregar los datos`);
  }
  catch(error){
    throw new HttpException(
      {status: HttpStatus.NOT_FOUND,error:`500 - ERROR: ` +error},
      HttpStatus.NOT_FOUND
    )
  }
}

public async updatePacienteId(id: number, pacienteDto: Partial<PacienteDto>): Promise<Paciente> {
  try {
    const criterio: FindOneOptions = { where: { id: id } };
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

public async deletePaciente(id : number) : Promise<boolean> {
  try {
     let criterio : FindOneOptions = { where: {id: id} };
     let paciente : Paciente = await this.pacienteRepository.findOne(criterio);
     if (!paciente)
     throw new Error(`No se pudo actualizar eliminar`)
     else
        await this.pacienteRepository.delete(id);
     return true;
  } catch(error){
    throw new HttpException(
      {status: HttpStatus.NOT_FOUND,error:`500 - ERROR: ` +error},
      HttpStatus.NOT_FOUND
    )
  }
}
}
