import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoTurno } from '../enums/estado-turno.enum';
import { CreateTurnoDto } from './create-turno.dto';

export class UpdateTurnoDto extends PartialType(CreateTurnoDto) {
  @IsOptional()
  @IsEnum(EstadoTurno)
  estado?: EstadoTurno;
}
