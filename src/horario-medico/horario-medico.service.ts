// src/horario-medico/horario-medico.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorarioMedico } from './entities/horario-medico.entity';
import { CreateHorarioMedicoDto } from './dto/create-horario-medico.dto';
import { UpdateHorarioMedicoDto } from './dto/update-horario-medico.dto';

@Injectable()
export class HorarioMedicoService {
  constructor(
    @InjectRepository(HorarioMedico)
    private readonly horarioRepository: Repository<HorarioMedico>,
  ) {}

  async create(dto: CreateHorarioMedicoDto): Promise<HorarioMedico> {
    if (dto.horaInicio >= dto.horaFin) {
      throw new BadRequestException('horaInicio debe ser anterior a horaFin');
    }

    await this.checkOverlap(dto.id_medico, dto.diaSemana, dto.horaInicio, dto.horaFin);

    const horario = this.horarioRepository.create(dto);
    return this.horarioRepository.save(horario);
  }

  private async checkOverlap(
    id_medico: number,
    diaSemana: number,
    horaInicio: string,
    horaFin: string,
    excludeId?: number,
  ): Promise<void> {
    const existentes = await this.horarioRepository.find({
      where: { id_medico, diaSemana },
    });

    for (const h of existentes) {
      if (excludeId !== undefined && h.id === excludeId) continue;
      const solapado =
        horaInicio < h.horaFin.substring(0, 5) &&
        horaFin > h.horaInicio.substring(0, 5);
      if (solapado) {
        throw new BadRequestException(
          `El rango ${horaInicio}-${horaFin} se solapa con el horario existente ${h.horaInicio.substring(0, 5)}-${h.horaFin.substring(0, 5)}`,
        );
      }
    }
  }

  findByMedico(id_medico: number): Promise<HorarioMedico[]> {
    return this.horarioRepository.find({
      where: { id_medico },
      order: { diaSemana: 'ASC' },
    });
  }

  async update(id: number, dto: UpdateHorarioMedicoDto): Promise<HorarioMedico> {
    const existing = await this.horarioRepository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`Horario con ID ${id} no encontrado`);
    }

    const inicio = dto.horaInicio ?? existing.horaInicio.substring(0, 5);
    const fin = dto.horaFin ?? existing.horaFin.substring(0, 5);

    if (inicio >= fin) {
      throw new BadRequestException('horaInicio debe ser anterior a horaFin');
    }

    const diaSemana = dto.diaSemana ?? existing.diaSemana;
    const id_medico = dto.id_medico ?? existing.id_medico;
    await this.checkOverlap(id_medico, diaSemana, inicio, fin, id);

    const horario = await this.horarioRepository.preload({ id, ...dto });
    return this.horarioRepository.save(horario!);
  }

  async remove(id: number): Promise<{ affected?: number }> {
    const result = await this.horarioRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Horario con ID ${id} no encontrado`);
    }
    return result;
  }
}
