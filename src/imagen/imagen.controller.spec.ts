import { Test, TestingModule } from '@nestjs/testing';
import { ImagenController } from './imagen.controller';
import { ImagenService } from './imagen.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('ImagenController', () => {
  let controller: ImagenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagenController],
      providers: [ImagenService, { provide: AuthGuard, useValue: { canActivate: () => true } }, { provide: JwtService, useValue: {} }],
    }).compile();

    controller = module.get<ImagenController>(ImagenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
