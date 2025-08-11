import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PacienteModule } from './paciente/paciente.module';
import { ConsultaModule } from './consulta/consulta.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicoModule } from './medico/medico.module';
import { ImagenModule } from './imagen/imagen.module';

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
