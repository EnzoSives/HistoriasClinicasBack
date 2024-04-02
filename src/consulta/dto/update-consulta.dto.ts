import { PartialType } from '@nestjs/mapped-types';
import { ConsultaDto } from './create-consulta.dto';

export class UpdateConsultaDto extends PartialType(ConsultaDto) {}
