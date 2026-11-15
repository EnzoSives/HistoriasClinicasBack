import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { Medico } from 'src/medico/entities/medico.entity';
import { ConflictException } from '@nestjs/common';

describe('PacienteService', () => {
  let service: PacienteService;
  const pacientes = {
    findOne: jest.fn(),
    create: jest.fn((value) => value),
    save: jest.fn((value) => Promise.resolve(value)),
  };
  const medicos = { findOne: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteService,
        { provide: getRepositoryToken(Paciente), useValue: pacientes },
        { provide: getRepositoryToken(Medico), useValue: medicos },
      ],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('rechaza un DNI repetido para el mismo médico al crear', async () => {
    medicos.findOne.mockResolvedValue({ id_medico: 3 });
    pacientes.findOne.mockResolvedValue({ id_paciente: 5 });

    await expect(service.crearPacienteConImagenes({ id_medico: 3, dni: ' 123 ' }, [])).rejects.toBeInstanceOf(ConflictException);
    expect(pacientes.findOne).toHaveBeenCalledWith({ where: { id_medico: 3, dni: '123' } });
    expect(pacientes.save).not.toHaveBeenCalled();
  });

  it('permite el mismo DNI en otro médico', async () => {
    medicos.findOne.mockResolvedValue({ id_medico: 4 });
    pacientes.findOne.mockResolvedValue(null);

    await service.crearPacienteConImagenes({ id_medico: 4, dni: ' 123 ' }, []);
    expect(pacientes.save).toHaveBeenCalledWith(expect.objectContaining({ id_medico: 4, dni: '123' }));
  });

  it('impide cambiar de médico durante una edición', async () => {
    pacientes.findOne.mockResolvedValue({ id_paciente: 8, id_medico: 3, dni: '123', imagenes: [] });

    await service.actualizarPacienteConImagenes(8, { id_medico: 9, nombre: 'Ana' }, [], 3);
    expect(pacientes.save).toHaveBeenCalledWith(expect.objectContaining({ id_medico: 3, nombre: 'Ana' }));
  });

  it('rechaza un DNI ocupado por otro paciente al editar', async () => {
    pacientes.findOne
      .mockResolvedValueOnce({ id_paciente: 8, id_medico: 3, dni: '123', imagenes: [] })
      .mockResolvedValueOnce({ id_paciente: 9, id_medico: 3, dni: '456' });

    await expect(service.actualizarPacienteConImagenes(8, { dni: ' 456 ' }, [], 3)).rejects.toBeInstanceOf(ConflictException);
    expect(pacientes.save).not.toHaveBeenCalled();
  });
});
