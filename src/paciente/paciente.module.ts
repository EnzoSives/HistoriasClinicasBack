import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { Paciente } from './entities/paciente.entity';
import { PacienteService } from './paciente.service';
import { PacienteController } from './paciente.controller';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import fs from 'fs';

@Module({
  imports: [
    TypeOrmModule.forFeature([Paciente]),
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Construir la ruta al directorio de uploads en el frontend
          const uploadPath = path.join(__dirname, '../../../HistoriasClinicasFront/public/uploads');

          // Crear el directorio si no existe
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          console.log(`Saving file to: ${uploadPath}`); // Para verificar la ruta
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

