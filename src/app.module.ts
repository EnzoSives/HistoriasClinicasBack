import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { PacienteModule } from './paciente/paciente.module';
import { ConsultaModule } from './consulta/consulta.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicoModule } from './medico/medico.module';
import { ImagenModule } from './imagen/imagen.module';
import { TurnoModule } from './turno/turno.module';
import { HorarioMedicoModule } from './horario-medico/horario-medico.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: Number(configService.get<string>('DB_PORT', '3306')),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_DATABASE', ''),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('DB_SYNCHRONIZE', 'false') === 'true',
      }),
    }),
    UsersModule,
    PacienteModule,
    ConsultaModule,
    AuthModule,
    MedicoModule,
    ImagenModule,
    TurnoModule,
    HorarioMedicoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
