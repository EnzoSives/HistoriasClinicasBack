export class PacienteDto {
    readonly nombre: string;
    readonly apellido: string;
    readonly dni: string;
    readonly sexo: string;
    readonly edad: number;
    readonly fechaNacimiento: Date;
    readonly lugarNacimiento: string;
    readonly direccion: string;
    readonly telefonoFijo: string;
    readonly telefonoCelular: string;
    readonly ocupacion: string;
    readonly estadoCivil: string;
    readonly obraSocial: string;
    readonly afiliadoObraSocial: string;
  }