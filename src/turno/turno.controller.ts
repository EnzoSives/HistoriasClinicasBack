// src/turno/turno.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { TurnoService } from './turno.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('turno')
@UseGuards(AuthGuard)
export class TurnoController {
  constructor(private readonly turnoService: TurnoService) {}

  @Post()
  create(@Body() createTurnoDto: CreateTurnoDto, @Request() req: any) {
    return this.turnoService.create({ ...createTurnoDto, id_medico: req.user.id_medico });
  }

  @Get('medico/:id_medico')
  findAllByMedico(@Param('id_medico', ParseIntPipe) id_medico: number, @Request() req: any) {
    return this.turnoService.findAllByMedico(req.user.id_medico);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTurnoDto: UpdateTurnoDto, @Request() req: any) {
    return this.turnoService.update(id, updateTurnoDto, req.user.id_medico);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.turnoService.remove(id, req.user.id_medico);
  }
}
