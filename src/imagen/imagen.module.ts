import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Imagen } from './entities/imagen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Imagen])],
  exports: [TypeOrmModule], // Exportamos para que otros módulos puedan usar el repositorio de Imagen
})
export class ImagenModule {}
