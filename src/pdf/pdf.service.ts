import { Injectable } from '@nestjs/common';
import { Consulta } from '../consulta/entities/consulta.entity';
import { Paciente } from 'src/paciente/entities/paciente.entity';
import jsPDF from 'jspdf';

@Injectable()
export class PdfService {
  generarPdf(paciente: Paciente, consultas: Consulta[]): Uint8Array {
    const doc = new jsPDF();
    const fontSize = 12;
    const margin = 15;
    let yPosition = margin;

    doc.setFontSize(fontSize + 6);
    doc.text('Historia clínica de consultorio', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(fontSize + 3);
    doc.text('Información del Paciente:', margin, yPosition);
    yPosition += 10;

    // Definir los datos del paciente manualmente
    const patientData = [
      { label: 'Nombre', value: paciente.nombre || 'No especificado' },
      { label: 'Apellido', value: paciente.apellido || 'No especificado' },
      { label: 'DNI', value: paciente.dni || 'No especificado' },
      { label: 'Sexo', value: paciente.sexo || 'No especificado' },
      { label: 'Edad', value: paciente.edad || 'No especificada' },
      { label: 'Fecha de Nacimiento', value: paciente.fechaNacimiento || 'No especificada' },
      { label: 'Lugar de Nacimiento', value: paciente.lugarNacimiento || 'No especificado' },
      { label: 'Dirección', value: paciente.direccion || 'No especificada' },
      { label: 'Teléfono Fijo', value: paciente.telefonoFijo || 'No especificado' },
      { label: 'Teléfono Celular', value: paciente.telefonoCelular || 'No especificado' },
      { label: 'Ocupación', value: paciente.ocupacion || 'No especificada' },
      { label: 'Estado Civil', value: paciente.estadoCivil || 'No especificado' },
      { label: 'Obra Social', value: paciente.obraSocial || 'No especificada' },
      { label: 'Afiliado a Obra Social', value: paciente.afiliadoObraSocial || 'No especificado' },
      { label: 'Antecedentes Personales Médicos', value: paciente.antecedentesPersonalesMedicos || 'No especificados' },
      { label: 'Antecedentes Quirúrgicos', value: paciente.antecedentesQuirurgicos || 'No especificados' },
      { label: 'Alergias', value: paciente.alergias || 'No especificadas' },
      { label: 'Antecedentes Heredo Familiares', value: paciente.antecedentesHeredoFamiliares || 'No especificados' },
      { label: 'Hábitos Tóxicos', value: paciente.habitosToxicos || 'No especificados' },
      { label: 'Medicación Habitual', value: paciente.medicacionHabitual || 'No especificada' },
      { label: 'Examen Físico - Hábitos', value: paciente.examenFisicoHabito || 'No especificados' },
      { label: 'Examen Físico - Peso', value: paciente.examenFisicoPeso || 'No especificado' },
      { label: 'Examen Físico - Talla', value: paciente.examenFisicoTalla || 'No especificada' },
      { label: 'Examen Físico - IMC', value: paciente.examenFisicoIMC || 'No especificado' },
      { label: 'Examen Físico - TA', value: paciente.examenFisicoTA || 'No especificado' },
      { label: 'Examen Físico - FC', value: paciente.examenFisicoFC || 'No especificado' },
      { label: 'Examen Físico - FR', value: paciente.examenFisicoFR || 'No especificado' },
      { label: 'Examen Físico - Temperatura', value: paciente.examenFisicoTemperatura || 'No especificada' },
      { label: 'Examen Físico - Sistema Nervioso', value: paciente.examenFisicoSistemaNervioso || 'No especificado' },
      { label: 'Examen Físico - AP Cardiovascular', value: paciente.examenFisicoAPCardiovascular || 'No especificado' },
      { label: 'Examen Físico - AP Respiratorio', value: paciente.examenFisicoAPRespiratorio || 'No especificado' },
      { label: 'Examen Físico - AP Digestivo', value: paciente.examenFisicoAPDigestivo || 'No especificado' },
      { label: 'Examen Físico - AP Genitourinario', value: paciente.examenFisicoAPGenitourinario || 'No especificado' },
      { label: 'Examen Físico - Sistema Endocrino', value: paciente.examenFisicoSistemaEndocrino || 'No especificado' },
      { label: 'Examen Físico - Sistema Hematopoyético', value: paciente.examenFisicoSistemaHematopoyetico || 'No especificado' },
      { label: 'Examen Físico - Sistema Musculo Esquelético', value: paciente.examenFisicoSistemaMusculoEsqueletico || 'No especificado' },
      { label: 'Examen Físico - Piel y Anexos', value: paciente.examenFisicoPielAnexos || 'No especificado' },
      { label: 'Primera Observación', value: paciente.primerObservacion || 'No especificada' },
    ];

    // Agregar datos del paciente al PDF
    doc.setFontSize(fontSize);
    patientData.forEach((data) => {
      doc.text(`${data.label}: ${data.value}`, margin, yPosition);
      yPosition += 7;
      if (yPosition > 280) { // Salto de página si se supera el límite
        doc.addPage();
        yPosition = margin;
      }
    });

    // Verificar si hay consultas disponibles
    if (consultas.length > 0) {
      // Crear una nueva sección para las consultas
      yPosition += 10;
      doc.setFontSize(fontSize + 4);
      doc.text('Consultas:', margin, yPosition);
      yPosition += 10;

      // Agregar información de consultas
      consultas.forEach((consulta, index) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = margin;
        }
        doc.setFontSize(fontSize + 2);
        doc.text(`Consulta ${index + 1}:`, margin, yPosition);
        yPosition += 7;

        doc.setFontSize(fontSize);
        doc.text(`Fecha y Hora: ${this.formatearFechaHora(consulta.fechaHoraInicio)}`, margin, yPosition);
        yPosition += 7;

        doc.text(`Motivo: ${consulta.motivoConsulta}`, margin, yPosition);
        yPosition += 7;

        doc.text(`Observaciones: ${consulta.observaciones || 'No especificadas'}`, margin, yPosition);
        yPosition += 10;
      });
    } else {
      // Mostrar mensaje de que no hay consultas disponibles
      yPosition += 10;
      doc.setFontSize(fontSize + 3);
      doc.text('No hay más consultas disponibles para este paciente.', margin, yPosition);
    }

    return new Uint8Array(doc.output('arraybuffer'));
  }

  formatearFechaHora(fechaISO: Date): string {
    const fecha = new Date(fechaISO);
    
    // Opciones para el formato de fecha y hora
    const opciones: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    
    return fecha.toLocaleString('es-ES', opciones); // Formato de fecha en español
  }
}
