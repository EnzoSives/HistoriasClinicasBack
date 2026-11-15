import { Controller, Get, NotFoundException, Param, Request, Res, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { join } from 'path';
import { Repository } from 'typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { Imagen } from './entities/imagen.entity';

@Controller('imagen/archivo')
@UseGuards(AuthGuard)
export class ArchivoController {
  constructor(
    @InjectRepository(Imagen) private readonly imagenes: Repository<Imagen>,
    private readonly config: ConfigService,
  ) {}

  @Get(':filename')
  async descargar(@Param('filename') filename: string, @Request() req: any, @Res() res: Response) {
    if (!/^[a-zA-Z0-9_-]+\.(png|jpe?g|gif|pdf)$/i.test(filename)) {
      throw new NotFoundException('Archivo no encontrado.');
    }
    const imagen = await this.imagenes.findOne({
      where: { filename },
      relations: ['paciente', 'consulta'],
    });
    const medicoId = req.user.id_medico;
    if (!imagen || !medicoId ||
        (imagen.paciente?.id_medico !== medicoId && imagen.consulta?.id_medico !== medicoId)) {
      throw new NotFoundException('Archivo no encontrado.');
    }
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.sendFile(filename, { root: join(process.cwd(), this.config.get('UPLOADS_DIR', 'uploads')) });
  }
}
