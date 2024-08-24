import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ParseIntPipe, Res } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { ConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { Consulta } from './entities/consulta.entity';
import { Response } from 'express';
import { PdfService } from '../pdf/pdf.service';

@Controller('consulta')
export class ConsultaController {
  constructor(private readonly consultaService: ConsultaService, private readonly pdfService: PdfService,) {}

  @Get('pdf')
  async descargarPdf(@Res() res: Response) {
    const consultas = await this.consultaService.getAll(); // Ajusta según tu método para obtener todas las consultas
    const pdfBuffer = await this.pdfService.generarPdf(consultas);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=consultas.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  @Get('pdf/:pacienteId')
  async descargarPdfPorPaciente(@Param('pacienteId') pacienteId: number, @Res() res: Response) {
    const consultas = await this.consultaService.getConsultasByPacienteId(pacienteId);
    const pdfBuffer = await this.pdfService.generarPdf(consultas);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=consultas_paciente_${pacienteId}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }


  @Post('crear')
  addDato(@Body() consulta:ConsultaDto ) : Promise<Consulta>{
      return this.consultaService.addConsulta(consulta);
  }

  @Get('all')
  async getconsultas(): Promise<Consulta[]>{
    return this.consultaService.getAll();
  }

  @Get(':id')
  async getId(@Param('id') id:number) : Promise<Consulta>{
    return this.consultaService.getId(id)
  }
  @Get('paciente/:idPaciente')
  async getConsultasByPacienteId(@Param('idPaciente', ParseIntPipe) idPaciente: number): Promise<Consulta[]> {
    // Obtiene las consultas del servicio.
    const consultas = await this.consultaService.getConsultasByPacienteId(idPaciente);
  
    // Devuelve las consultas.
    return consultas;
  }
  
  @Patch('actualizar/:id')
  updateDatoId(@Param('id')id:number, @Body() consulta: ConsultaDto) : Promise<Consulta>{
    return this.consultaService.updateConsultaId(id,consulta);
  }

  @Delete('eliminar/:id')
  deleteDato(@Param('id') id : number) : Promise<boolean> {
    return this.consultaService.deleteconsulta(id);
  }
}

