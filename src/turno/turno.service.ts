// src/turno/turno.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Not, Repository } from 'typeorm';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { Turno } from './entities/turno.entity';
import { Medico } from 'src/medico/entities/medico.entity';
import { Paciente } from 'src/paciente/entities/paciente.entity';
import { HorarioMedico } from 'src/horario-medico/entities/horario-medico.entity';
import { EstadoTurno } from './enums/estado-turno.enum';
import { DIA_SEMANA_NOMBRES } from './enums/dia-semana.enum';

@Injectable()
export class TurnoService {
  constructor(
    @InjectRepository(Turno)
    private readonly turnoRepository: Repository<Turno>,
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
    @InjectRepository(HorarioMedico)
    private readonly horarioRepository: Repository<HorarioMedico>,
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

    const fechaHora = new Date(createTurnoDto.fechaHora);
    const diaSemana = fechaHora.getDay();

    const horariosDelDia = await this.horarioRepository.find({
      where: { id_medico: createTurnoDto.id_medico, diaSemana },
    });
    if (!horariosDelDia.length) {
      throw new BadRequestException(
        `El médico no tiene horario disponible el ${DIA_SEMANA_NOMBRES[diaSemana]}`,
      );
    }

    const horaStr = `${String(fechaHora.getHours()).padStart(2, '0')}:${String(fechaHora.getMinutes()).padStart(2, '0')}`;
    const horario = horariosDelDia.find(
      (h) =>
        horaStr >= h.horaInicio.substring(0, 5) &&
        horaStr <= h.horaFin.substring(0, 5),
    );
    if (!horario) {
      const franjas = horariosDelDia
        .map((h) => `${h.horaInicio.substring(0, 5)}-${h.horaFin.substring(0, 5)}`)
        .join(', ');
      throw new BadRequestException(
        `El horario solicitado no está dentro de ninguna franja disponible: ${franjas}`,
      );
    }

    const [inicioH, inicioM] = horario.horaInicio.split(':').map(Number);
    const turnoMinutos = fechaHora.getHours() * 60 + fechaHora.getMinutes();
    const inicioMinutos = inicioH * 60 + inicioM;
    if ((turnoMinutos - inicioMinutos) % horario.duracionMinutos !== 0) {
      throw new BadRequestException(
        `El horario debe coincidir con un slot de ${horario.duracionMinutos} minutos a partir de las ${horario.horaInicio.substring(0, 5)}`,
      );
    }

    const startOfDay = new Date(fechaHora);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(fechaHora);
    endOfDay.setHours(23, 59, 59, 999);

    const maxTotalDia = horariosDelDia.reduce((acc, h) => acc + h.maxTurnosPorDia, 0);
    const turnosDelDia = await this.turnoRepository.count({
      where: {
        id_medico: createTurnoDto.id_medico,
        fechaHora: Between(startOfDay, endOfDay),
        estado: Not(EstadoTurno.CANCELADO),
      },
    });
    if (turnosDelDia >= maxTotalDia) {
      throw new BadRequestException(
        `El médico ya alcanzó el límite de ${maxTotalDia} turnos para ese día`,
      );
    }

    const slotOcupado = await this.turnoRepository.findOne({
      where: {
        id_medico: createTurnoDto.id_medico,
        fechaHora,
        estado: Not(EstadoTurno.CANCELADO),
      },
    });
    if (slotOcupado) {
      throw new BadRequestException(`Ya existe un turno para ese médico en ese horario`);
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