import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { Paciente } from './entities/paciente.entity';
import { PacienteService } from './paciente.service';
import { PacienteController } from './paciente.controller';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import os from 'os';  // Importa el módulo os

@Module({
  imports: [
    TypeOrmModule.forFeature([Paciente]),
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Expande el `~` a la ruta completa del usuario
          const homeDir = os.homedir();
          const uploadPath = path.join(homeDir, 'App/HistoriasClinicasFront/public/uploads');
          console.log(`Saving file to: ${uploadPath}`);  // Verificar la ruta generada
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  ],
  controllers: [PacienteController],
  providers: [PacienteService],
})
export class PacienteModule {}
