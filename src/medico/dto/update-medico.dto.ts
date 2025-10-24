import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicoDto } from './create-medico.dto';

// Al heredar, todos los campos de CreateMedicoDto se vuelven opcionales
export class UpdateMedicoDto extends PartialType(CreateMedicoDto) {}