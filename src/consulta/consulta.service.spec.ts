import { Test, TestingModule } from '@nestjs/testing';
import { ConsultaService } from './consulta.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Consulta } from './entities/consulta.entity';
import { Paciente } from 'src/paciente/entities/paciente.entity';
import { NotFoundException } from '@nestjs/common';

describe('ConsultaService', () => {
  let service: ConsultaService;
  const consultas = { find: jest.fn() };
  const pacientes = { findOne: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultaService,
        { provide: getRepositoryToken(Consulta), useValue: consultas },
        { provide: getRepositoryToken(Paciente), useValue: pacientes },
      ],
    }).compile();

    service = module.get<ConsultaService>(ConsultaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('devuelve lista vacía si el paciente existe y aún no tiene consultas', async () => {
    pacientes.findOne.mockResolvedValue({ id_paciente: 7, id_medico: 3 });
    consultas.find.mockResolvedValue([]);
    await expect(service.getConsultasByPacienteId(7, 3)).resolves.toEqual([]);
    expect(pacientes.findOne).toHaveBeenCalledWith({ where: { id_paciente: 7, id_medico: 3 } });
  });

  it('no consulta el historial de un paciente ajeno', async () => {
    pacientes.findOne.mockResolvedValue(null);
    await expect(service.getConsultasByPacienteId(7, 3)).rejects.toBeInstanceOf(NotFoundException);
    expect(consultas.find).not.toHaveBeenCalled();
  });
});
