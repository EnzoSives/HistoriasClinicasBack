// src/turno/enums/dia-semana.enum.ts
export enum DiaSemana {
  DOMINGO = 0,
  LUNES = 1,
  MARTES = 2,
  MIERCOLES = 3,
  JUEVES = 4,
  VIERNES = 5,
  SABADO = 6,
}

export const DIA_SEMANA_NOMBRES: Record<DiaSemana, string> = {
  [DiaSemana.DOMINGO]: 'domingo',
  [DiaSemana.LUNES]: 'lunes',
  [DiaSemana.MARTES]: 'martes',
  [DiaSemana.MIERCOLES]: 'miércoles',
  [DiaSemana.JUEVES]: 'jueves',
  [DiaSemana.VIERNES]: 'viernes',
  [DiaSemana.SABADO]: 'sábado',
};
