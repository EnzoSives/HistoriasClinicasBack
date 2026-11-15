import { Test, TestingModule } from '@nestjs/testing';
import { PacienteController } from './paciente.controller';
import { PacienteService } from './paciente.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('PacienteController', () => {
  let controller: PacienteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PacienteController],
      providers: [
        { provide: PacienteService, useValue: {} },
        { provide: AuthGuard, useValue: { canActivate: () => true } },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    controller = module.get<PacienteController>(PacienteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
