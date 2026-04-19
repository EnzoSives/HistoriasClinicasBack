// src/horario-medico/dto/create-horario-medico.dto.ts
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { DiaSemana } from 'src/turno/enums/dia-semana.enum';

export class CreateHorarioMedicoDto {
  @IsNotEmpty()
  @IsInt()
  id_medico: number;

  @IsEnum(DiaSemana)
  diaSemana: DiaSemana;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'horaInicio debe tener formato HH:MM',
  })
  horaInicio: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'horaFin debe tener formato HH:MM',
  })
  horaFin: string;

  @IsInt()
  @Min(10)
  @Max(240)
  duracionMinutos: number;

  @IsInt()
  @Min(1)
  maxTurnosPorDia: number;
}
