import { Injectable } from '@nestjs/common';
import { Consulta } from '../consulta/entities/consulta.entity';
import { Paciente } from 'src/paciente/entities/paciente.entity';
import jsPDF from 'jspdf';

@Injectable()
export class PdfService {
  generarPdf(paciente: Paciente, consultas: Consulta[]): Uint8Array {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - 2 * margin;
    const colWidth = usableWidth / 2 - 5;
    const titleFontSize = 16;
    const sectionFontSize = 12;
    const normalFontSize = 10;
    const labelColor = '#505050';
    const valueColor = '#000000';

    let yPosition = margin;

    // --- Título Principal ---
    doc.setFontSize(titleFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text('HISTORIA CLÍNICA MÉDICA', pageWidth / 2, yPosition, {
      align: 'center',
    });
    yPosition += 5;
    doc.setFontSize(normalFontSize - 2);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'NORMA OFICIAL MEXICANA NOM-004-SSA3-2012, DEL EXPEDIENTE CLÍNICO',
      pageWidth / 2,
      yPosition,
      { align: 'center' },
    );
    yPosition += 10;

    // --- Función para dibujar encabezado de sección ---
    const dibujarEncabezadoSeccion = (titulo: string) => {
      if (yPosition > 260) {
        doc.addPage();
        yPosition = margin;
      }
      doc.setFillColor(238, 204, 221); // Color rosa suave
      doc.rect(margin, yPosition, usableWidth, 8, 'F');
      doc.setFontSize(sectionFontSize);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor('#FFFFFF');
      doc.text(titulo, margin + 3, yPosition + 6);
      yPosition += 12;
      doc.setTextColor(valueColor);
    };

    // --- Función para agregar campo y valor en dos columnas ---
    let currentX = margin;
    let isLeftCol = true;

    const agregarCampo = (label: string, value: any) => {
        const textValue = String(value || 'No especificado');
        const splitText = doc.splitTextToSize(`${label}: ${textValue}`, colWidth);

        if (yPosition + (splitText.length * 5) > 280) { // Salto de página si no hay espacio
            doc.addPage();
            yPosition = margin;
            isLeftCol = true;
            currentX = margin;
        }
        
        doc.setFontSize(normalFontSize);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(labelColor);
        doc.text(`${label}:`, currentX, yPosition);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(valueColor);
        doc.text(textValue, currentX + 35, yPosition, {
            maxWidth: colWidth - 35,
        });

        const textHeight = doc.getTextDimensions(textValue, { maxWidth: colWidth - 35, fontSize: normalFontSize }).h;
        
        if (isLeftCol) {
            currentX = margin + colWidth + 10;
        } else {
            currentX = margin;
            yPosition += Math.max(7, textHeight + 2); // Incrementa Y después de la segunda columna
        }
        isLeftCol = !isLeftCol;

        // Si volvemos a la primera columna y el contenido era alto
        if (isLeftCol && (yPosition > 280)) {
           doc.addPage();
           yPosition = margin;
        }
    };
    
    const resetCols = () => {
        if (!isLeftCol) {
            yPosition += 7;
        }
        isLeftCol = true;
        currentX = margin;
        yPosition += 5; // Espacio extra después de la sección
    };
    
    // --- FICHA DE IDENTIFICACIÓN ---
    dibujarEncabezadoSeccion('FICHA DE IDENTIFICACIÓN');
    agregarCampo('Nombre', paciente.nombre);
    agregarCampo('Apellido', paciente.apellido);
    agregarCampo('DNI', paciente.dni);
    agregarCampo('Sexo', paciente.sexo);
    agregarCampo('Edad', paciente.edad);
    agregarCampo('Fecha de Nac.', paciente.fechaNacimiento);
    agregarCampo('Lugar de Nac.', paciente.lugarNacimiento);
    agregarCampo('Dirección', paciente.direccion);
    agregarCampo('Teléfono Fijo', paciente.telefonoFijo);
    agregarCampo('Teléfono Celular', paciente.telefonoCelular);
    agregarCampo('Ocupación', paciente.ocupacion);
    agregarCampo('Estado Civil', paciente.estadoCivil);
    agregarCampo('Obra Social', paciente.obraSocial);
    agregarCampo('Nº Afiliado', paciente.afiliadoObraSocial);
    resetCols();

    // --- ANTECEDENTES ---
    const agregarCampoAncho = (label: string, value: string) => {
        if (yPosition > 260) {
            doc.addPage();
            yPosition = margin;
        }
        doc.setFontSize(normalFontSize);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(labelColor);
        doc.text(label, margin, yPosition);
        yPosition += 5;
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(valueColor);
        const textLines = doc.splitTextToSize(value || 'No especificados', usableWidth);
        doc.text(textLines, margin, yPosition);
        yPosition += textLines.length * 5 + 3; // Ajustar el espacio después del texto
    };

    dibujarEncabezadoSeccion('ANTECEDENTES');
    agregarCampoAncho('Antecedentes Personales Médicos:', paciente.antecedentesPersonalesMedicos);
    agregarCampoAncho('Antecedentes Quirúrgicos:', paciente.antecedentesQuirurgicos);
    agregarCampoAncho('Alergias:', paciente.alergias);
    agregarCampoAncho('Antecedentes Heredo Familiares:', paciente.antecedentesHeredoFamiliares);
    agregarCampoAncho('Hábitos Tóxicos:', paciente.habitosToxicos);
    agregarCampoAncho('Medicación Habitual:', paciente.medicacionHabitual);
    yPosition += 5;

    // --- EXAMEN FÍSICO ---
    dibujarEncabezadoSeccion('EXAMEN FÍSICO');
    agregarCampo('Hábitos', paciente.examenFisicoHabito);
    agregarCampo('Peso', paciente.examenFisicoPeso);
    agregarCampo('Talla', paciente.examenFisicoTalla);
    agregarCampo('IMC', paciente.examenFisicoIMC);
    agregarCampo('TA', paciente.examenFisicoTA);
    agregarCampo('FC', paciente.examenFisicoFC);
    agregarCampo('FR', paciente.examenFisicoFR);
    agregarCampo('Temperatura', paciente.examenFisicoTemperatura);
    resetCols();
    
    agregarCampoAncho('Sistema Nervioso:', paciente.examenFisicoSistemaNervioso);
    agregarCampoAncho('AP Cardiovascular:', paciente.examenFisicoAPCardiovascular);
    agregarCampoAncho('AP Respiratorio:', paciente.examenFisicoAPRespiratorio);
    agregarCampoAncho('AP Digestivo:', paciente.examenFisicoAPDigestivo);
    yPosition += 5;

    // --- CONSULTAS ---
    if (consultas && consultas.length > 0) {
      if (yPosition > 240) {
        doc.addPage();
        yPosition = margin;
      }
      dibujarEncabezadoSeccion('CONSULTAS');
      
      consultas.forEach((consulta, index) => {
        if (yPosition > 260) {
          doc.addPage();
          yPosition = margin;
        }
        
        doc.setFontSize(normalFontSize + 1);
        doc.setFont('helvetica', 'bold');
        doc.text(`Consulta ${index + 1} - ${this.formatearFechaHora(consulta.fechaConsulta)}`, margin, yPosition);
        yPosition += 7;
        
        agregarCampoAncho('Motivo:', consulta.motivoConsulta);
        agregarCampoAncho('Observaciones:', consulta.observaciones);
        yPosition += 3;

        doc.setDrawColor(200);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 5;
      });
    }

    return new Uint8Array(doc.output('arraybuffer'));
  }

  formatearFechaHora(fechaISO: Date): string {
    const fecha = new Date(fechaISO);
    const opciones: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return fecha.toLocaleString('es-ES', opciones);
  }
}