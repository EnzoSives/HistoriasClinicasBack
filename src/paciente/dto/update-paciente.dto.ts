import { PartialType } from '@nestjs/mapped-types';
import { PacienteDto } from './create-paciente.dto';

export class UpdatePacienteDto extends PartialType(PacienteDto) {}
