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
  Request,
  UseGuards,
} from '@nestjs/common';
import { HorarioMedicoService } from './horario-medico.service';
import { CreateHorarioMedicoDto } from './dto/create-horario-medico.dto';
import { UpdateHorarioMedicoDto } from './dto/update-horario-medico.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('horario-medico')
@UseGuards(AuthGuard)
export class HorarioMedicoController {
  constructor(private readonly horarioMedicoService: HorarioMedicoService) {}

  @Post()
  create(@Body() dto: CreateHorarioMedicoDto, @Request() req: any) {
    return this.horarioMedicoService.create(dto, req.user.id_medico);
  }

  @Get('medico/:id_medico')
  findByMedico(@Param('id_medico', ParseIntPipe) id_medico: number, @Request() req: any) {
    return this.horarioMedicoService.findByMedico(req.user.id_medico);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHorarioMedicoDto,
    @Request() req: any,
  ) {
    return this.horarioMedicoService.update(id, dto, req.user.id_medico);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.horarioMedicoService.remove(id, req.user.id_medico);
  }
}
