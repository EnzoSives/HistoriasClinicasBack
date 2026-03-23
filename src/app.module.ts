import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
    ServeStaticModule.forRoot({
      serveRoot: '/uploads',
      rootPath: join(__dirname, '..', 'uploads'),
      serveStaticOptions: {
        index: false,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '66.97.45.96',
      port: 3306,
      username: 'base_enzo',
      password: '%#zn7ajqx0qrljLr',
      database: 'historias_clinicas_pruebas',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: '179.43.127.133',
    //   port: 3306,
    //   username: 'insp_pruebas',
    //   password: '%#zn7ajqx0qrljLr',
    //   database: 'pruebas_enzo',
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   synchronize: true,
    // }),
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
