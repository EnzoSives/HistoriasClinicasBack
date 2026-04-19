// src/horario-medico/horario-medico.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { HorarioMedicoService } from './horario-medico.service';
import { CreateHorarioMedicoDto } from './dto/create-horario-medico.dto';
import { UpdateHorarioMedicoDto } from './dto/update-horario-medico.dto';

@Controller('horario-medico')
export class HorarioMedicoController {
  constructor(private readonly horarioMedicoService: HorarioMedicoService) {}

  @Post()
  create(@Body() dto: CreateHorarioMedicoDto) {
    return this.horarioMedicoService.create(dto);
  }

  @Get('medico/:id_medico')
  findByMedico(@Param('id_medico', ParseIntPipe) id_medico: number) {
    return this.horarioMedicoService.findByMedico(id_medico);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHorarioMedicoDto,
  ) {
    return this.horarioMedicoService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.horarioMedicoService.remove(id);
  }
}
