// src/turno/turno.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { Turno } from './entities/turno.entity';
import { Medico } from 'src/medico/entities/medico.entity';
import { Paciente } from 'src/paciente/entities/paciente.entity';

@Injectable()
export class TurnoService {
  constructor(
    @InjectRepository(Turno)
    private readonly turnoRepository: Repository<Turno>,
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
  ) {}

  async create(createTurnoDto: CreateTurnoDto): Promise<Turno> {
    const medico = await this.medicoRepository.findOneBy({ id_medico: createTurnoDto.id_medico });
    if (!medico) {
      throw new NotFoundException(`Médico con ID ${createTurnoDto.id_medico} no encontrado`);
    }

    const paciente = await this.pacienteRepository.findOneBy({ id_paciente: createTurnoDto.id_paciente });
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${createTurnoDto.id_paciente} no encontrado`);
    }

    const nuevoTurno = this.turnoRepository.create({
      ...createTurnoDto,
      medico,
      paciente,
    });

    return this.turnoRepository.save(nuevoTurno);
  }

  findAllByMedico(id_medico: number): Promise<Turno[]> {
    return this.turnoRepository.find({
      where: { id_medico },
      relations: ['paciente'], // Carga la información del paciente asociada
      order: { fechaHora: 'ASC' },
    });
  }

  async update(id: number, updateTurnoDto: UpdateTurnoDto): Promise<Turno> {
    const turno = await this.turnoRepository.preload({
      id_turno: id,
      ...updateTurnoDto,
    });

    if (!turno) {
      throw new NotFoundException(`Turno con ID ${id} no encontrado`);
    }
    return this.turnoRepository.save(turno);
  }

  async remove(id: number): Promise<{ affected?: number }> {
    const result = await this.turnoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Turno con ID ${id} no encontrado`);
    }
    return result;
  }
}