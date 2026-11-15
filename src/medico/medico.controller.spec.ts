import { Test, TestingModule } from '@nestjs/testing';
import { MedicoController } from './medico.controller';
import { MedicoService } from './medico.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('MedicoController', () => {
  let controller: MedicoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicoController],
      providers: [MedicoService, { provide: AuthGuard, useValue: { canActivate: () => true } }, { provide: JwtService, useValue: {} }],
    }).compile();

    controller = module.get<MedicoController>(MedicoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
