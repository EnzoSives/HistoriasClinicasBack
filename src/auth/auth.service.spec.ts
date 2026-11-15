import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Medico } from 'src/medico/entities/medico.entity';

describe('AuthService', () => {
  let service: AuthService;
  const medicos = { save: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: getRepositoryToken(Medico), useValue: medicos },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('solo modifica campos editables del perfil médico', async () => {
    const user = { id: 4, role: 'medico', medico: { id_medico: 3, nombre: 'Ana', user_id: 4 } };
    jest.spyOn(service, 'obtenerPerfilCompleto').mockResolvedValue(user as any);
    jest.spyOn(service, 'obtenerPerfilPublico').mockResolvedValue({} as any);
    medicos.save.mockResolvedValue(user.medico);

    await service.actualizarPerfil(4, { nombre: ' Beatriz ', id_medico: 99, user_id: 99 } as any);
    expect(medicos.save).toHaveBeenCalledWith({ id_medico: 3, nombre: 'Beatriz', user_id: 4 });
    expect(user.role).toBe('medico');
  });
});
