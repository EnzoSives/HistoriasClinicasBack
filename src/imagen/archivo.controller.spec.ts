import { NotFoundException } from '@nestjs/common';
import { ArchivoController } from './archivo.controller';

describe('ArchivoController', () => {
  const imagenes = { findOne: jest.fn() };
  const config = { get: jest.fn().mockReturnValue('uploads') };
  const controller = new ArchivoController(imagenes as any, config as any);
  const response = {
    setHeader: jest.fn(),
    sendFile: jest.fn().mockReturnValue('enviado'),
  };

  beforeEach(() => jest.clearAllMocks());

  it('rechaza rutas y nombres no permitidos', async () => {
    await expect(controller.descargar('../otro.pdf', { user: { id_medico: 3 } }, response as any))
      .rejects.toBeInstanceOf(NotFoundException);
    expect(imagenes.findOne).not.toHaveBeenCalled();
  });

  it('rechaza archivos de otro médico', async () => {
    imagenes.findOne.mockResolvedValue({ paciente: { id_medico: 5 } });
    await expect(controller.descargar('estudio.pdf', { user: { id_medico: 3 } }, response as any))
      .rejects.toBeInstanceOf(NotFoundException);
    expect(response.sendFile).not.toHaveBeenCalled();
  });

  it('entrega archivos del médico propietario', async () => {
    imagenes.findOne.mockResolvedValue({ consulta: { id_medico: 3 } });
    await expect(controller.descargar('estudio.pdf', { user: { id_medico: 3 } }, response as any))
      .resolves.toBe('enviado');
    expect(response.sendFile).toHaveBeenCalled();
  });
});
