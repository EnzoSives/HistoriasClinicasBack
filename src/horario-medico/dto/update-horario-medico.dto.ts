// src/horario-medico/dto/update-horario-medico.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateHorarioMedicoDto } from './create-horario-medico.dto';

export class UpdateHorarioMedicoDto extends PartialType(CreateHorarioMedicoDto) {}
