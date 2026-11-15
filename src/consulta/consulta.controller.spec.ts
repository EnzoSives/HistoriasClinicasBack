import { Test, TestingModule } from '@nestjs/testing';
import { ConsultaController } from './consulta.controller';
import { ConsultaService } from './consulta.service';
import { PdfService } from 'src/pdf/pdf.service';
import { PacienteService } from 'src/paciente/paciente.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('ConsultaController', () => {
  let controller: ConsultaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultaController],
      providers: [
        { provide: ConsultaService, useValue: {} },
        { provide: PdfService, useValue: {} },
        { provide: PacienteService, useValue: {} },
        { provide: AuthGuard, useValue: { canActivate: () => true } },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    controller = module.get<ConsultaController>(ConsultaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
