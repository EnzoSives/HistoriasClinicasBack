import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ParseIntPipe, Res } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { ConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { Consulta } from './entities/consulta.entity';
import { Response } from 'express';
import { PdfService } from '../pdf/pdf.service';
import { PacienteService } from 'src/paciente/paciente.service'; // Importar el servicio de paciente
import { Paciente } from 'src/paciente/entities/paciente.entity';

@Controller('consulta')
export class ConsultaController {
  constructor(
    private readonly consultaService: ConsultaService,
    private readonly pdfService: PdfService,
    private readonly pacienteService: PacienteService, // Inyectar el servicio de paciente
  ) {}

  @Get('pdf')
  async descargarPdf(@Res() res: Response) {
    const consultas = await this.consultaService.getAll();
    const pdfBuffer = await this.pdfService.generarPdf(null, consultas); // Pasar `null` si no hay un paciente específico

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=consultas.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
  @Get('pdf/:pacienteId')
  async descargarPdfPorPaciente(
    @Param('pacienteId', ParseIntPipe) pacienteId: number,
    @Res() res: Response,
  ) {
    // Obtener el paciente por ID
    const paciente: Paciente = await this.pacienteService.getId(pacienteId);
    if (!paciente) {
      throw new HttpException('Paciente no encontrado', HttpStatus.NOT_FOUND);
    }
  
    // Intentar obtener las consultas del paciente, pero continuar si hay un error
    let consultas: Consulta[] = [];
    try {
      consultas = await this.consultaService.getConsultasByPacienteId(pacienteId);
    } catch (error) {
      console.warn(`No se pudieron obtener las consultas para el paciente ${pacienteId}:`, error);
      // Se continúa con un arreglo vacío para consultas
    }
  
    // Generar el PDF con la información del paciente y sus consultas (si las hay)
    const pdfBuffer = await this.pdfService.generarPdf(paciente, consultas);
  
    // Configurar y enviar el PDF como respuesta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=consultas_paciente_${pacienteId}.pdf`,
      'Content-Length': pdfBuffer.length,
    });
  
    res.end(pdfBuffer);
  }
  
  @Post('crear')
  addDato(@Body() consulta: ConsultaDto): Promise<Consulta> {
    return this.consultaService.addConsulta(consulta);
  }

  @Get('all')
  async getConsultas(): Promise<Consulta[]> {
    return this.consultaService.getAll();
  }

  @Get(':id')
  async getId(@Param('id') id: number): Promise<Consulta> {
    return this.consultaService.getId(id);
  }

  @Get('paciente/:idPaciente')
  async getConsultasByPacienteId(@Param('idPaciente', ParseIntPipe) idPaciente: number): Promise<Consulta[]> {
    const consultas = await this.consultaService.getConsultasByPacienteId(idPaciente);
    return consultas;
  }

  @Patch('actualizar/:id')
  updateDatoId(@Param('id') id: number, @Body() consulta: ConsultaDto): Promise<Consulta> {
    return this.consultaService.updateConsultaId(id, consulta);
  }

  @Delete('eliminar/:id')
  deleteDato(@Param('id') id: number): Promise<boolean> {
    return this.consultaService.deleteconsulta(id);
  }
}
