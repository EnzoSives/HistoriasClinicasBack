// pdf.service.ts
import { Injectable } from '@nestjs/common';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Consulta } from '../consulta/entities/consulta.entity'; // Asegúrate de ajustar la ruta según tu estructura de proyecto

@Injectable()
export class PdfService {
  async generarPdf(consultas: Consulta[]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;
    
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    
    let yPosition = height - 4 * fontSize;

    page.drawText('Reporte de Consultas', {
      x: 50,
      y: yPosition,
      size: fontSize + 4,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    yPosition -= 2 * fontSize;

    consultas.forEach((consulta, index) => {
      page.drawText(`Consulta ${index + 1}:`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });

      yPosition -= fontSize;
      page.drawText(`Fecha y Hora: ${consulta.fechaHoraInicio}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });

      yPosition -= fontSize;
      page.drawText(`Motivo: ${consulta.motivoConsulta}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });

      yPosition -= fontSize;
      page.drawText(`Observaciones: ${consulta.observaciones}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });

      yPosition -= 2 * fontSize;
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }
}
