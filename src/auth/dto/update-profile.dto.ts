import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateMedicoProfileDto {
  @IsOptional() @IsString() nombre?: string;
  @IsOptional() @IsString() apellido?: string;
  @IsOptional() @IsString() dni?: string;
  @IsOptional() @IsString() telefono?: string;
  @IsOptional() @IsString() especialidad?: string;
  @IsOptional() @IsString() matricula?: string;
  @IsOptional() @IsString() colegioMedico?: string;
  @IsOptional() @IsString() direccionConsultorio?: string;
  @IsOptional() @IsString() telefonoConsultorio?: string;
  @IsOptional() @IsString() horarioAtencion?: string;
  @IsOptional() @IsString() obrasSocialesAcepta?: string;
  @IsOptional() @IsString() biografia?: string;
  @IsOptional() @IsString() foto?: string;
}

export class UpdateProfileDto {
  @ValidateNested()
  @Type(() => UpdateMedicoProfileDto)
  medico: UpdateMedicoProfileDto;
}
