import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ParseIntPipe, Res, UseGuards, Request, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { ConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { Consulta } from './entities/consulta.entity';
import { Response } from 'express';
import { PdfService } from '../pdf/pdf.service';
import { PacienteService } from 'src/paciente/paciente.service'; // Importar el servicio de paciente
import { Paciente } from 'src/paciente/entities/paciente.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';

@Controller('consulta')
@UseGuards(AuthGuard)
export class ConsultaController {
  constructor(
    private readonly consultaService: ConsultaService,
    private readonly pdfService: PdfService,
    private readonly pacienteService: PacienteService, // Inyectar el servicio de paciente
  ) {}

  @Get('pdf')
  async descargarPdf(@Request() req: any, @Res() res: Response) {
    const consultas = await this.consultaService.getConsultasByMedicoId(req.user.id_medico);
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
    @Request() req: any,
    @Res() res: Response,
  ) {
    // Obtener el paciente por ID
    const paciente: Paciente = await this.pacienteService.getId(pacienteId, req.user.id_medico);
    if (!paciente) {
      throw new HttpException('Paciente no encontrado', HttpStatus.NOT_FOUND);
    }
  
    // Intentar obtener las consultas del paciente, pero continuar si hay un error
    let consultas: Consulta[] = [];
    try {
      consultas = await this.consultaService.getConsultasByPacienteId(pacienteId, req.user.id_medico);
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
  
// @UseGuards(AuthGuard) // <-- 1. SE COMENTA O ELIMINA EL GUARDIA
  @Post('crear')
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  crearConsulta(
    @Body() consultaDto: ConsultaDto, // El DTO ahora incluye id_medico
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: any,
  ): Promise<Consulta> {
    // 2. Se obtiene el id_medico directamente del DTO
    const id_medico = req.user.id_medico;

    if (!id_medico) {
      throw new HttpException(
          'El id_medico es requerido en el cuerpo de la solicitud', 
          HttpStatus.BAD_REQUEST
      );
    }
    
    return this.consultaService.crearConsultaConImagenes(consultaDto, files, id_medico);
  }


  @Get('all')
  async getConsultas(@Request() req: any): Promise<Consulta[]> {
    return this.consultaService.getConsultasByMedicoId(req.user.id_medico);
  }

  @Get(':id')
  async getId(@Param('id', ParseIntPipe) id: number, @Request() req: any): Promise<Consulta> {
    return this.consultaService.getId(id, req.user.id_medico);
  }

  @Get('paciente/:idPaciente')
  async getConsultasByPacienteId(@Param('idPaciente', ParseIntPipe) idPaciente: number, @Request() req: any): Promise<Consulta[]> {
    const consultas = await this.consultaService.getConsultasByPacienteId(idPaciente, req.user.id_medico);
    return consultas;
  }

  @Get('medico/:id_medico')
  async getConsultasByMedicoId(@Param('id_medico', ParseIntPipe) id_medico: number, @Request() req: any): Promise<Consulta[]> {
    return this.consultaService.getConsultasByMedicoId(req.user.id_medico);
  }

  @Patch('actualizar/:id')
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  updateDatoId(@Param('id', ParseIntPipe) id: number, @Body() consulta: UpdateConsultaDto, @UploadedFiles() files: Express.Multer.File[], @Request() req: any): Promise<Consulta> {
    return this.consultaService.updateConsultaId(id, consulta, req.user.id_medico, files);
  }

  @Delete('eliminar/:id')
  deleteDato(@Param('id', ParseIntPipe) id: number, @Request() req: any): Promise<boolean> {
    return this.consultaService.deleteconsulta(id, req.user.id_medico);
  }
}
