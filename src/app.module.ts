import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static'; // <-- 1. IMPORTAR
import { join } from 'path'; // <-- 2. IMPORTAR

import { UsersModule } from './users/users.module';
import { PacienteModule } from './paciente/paciente.module';
import { ConsultaModule } from './consulta/consulta.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicoModule } from './medico/medico.module';
import { ImagenModule } from './imagen/imagen.module';
import { TurnoModule } from './turno/turno.module';

@Module({
  imports: [
    // --- 3. AÑADIR ESTE BLOQUE ---
    ServeStaticModule.forRoot({
      serveRoot: '/uploads', // La URL pública (ej: http://localhost:3000/uploads/imagen.jpg)
      rootPath: join(__dirname, '..', 'uploads'), // La carpeta física en tu servidor
    }),
    // --- FIN DEL BLOQUE AÑADIDO ---

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '179.43.127.133',
      port: 3306,
      username: 'insp_pruebas',
      password: '%#zn7ajqx0qrljLr',
      database: 'pruebas_enzo',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    PacienteModule,
    ConsultaModule,
    AuthModule,
    MedicoModule,
    ImagenModule,
    TurnoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}