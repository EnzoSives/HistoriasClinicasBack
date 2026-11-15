import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Imagen } from './entities/imagen.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ArchivoController } from './archivo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Imagen]), AuthModule],
  controllers: [ArchivoController],
  exports: [TypeOrmModule], // Exportamos para que otros módulos puedan usar el repositorio de Imagen
})
export class ImagenModule {}
