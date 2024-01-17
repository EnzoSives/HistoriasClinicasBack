import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PacienteModule } from './paciente/paciente.module';
import { ConsultaModule } from './consulta/consulta.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'b0f8arjbbobjpsje6bub-mysql.services.clever-cloud.com',
      port: 3306,
      username: 'u9ze4aydevqy5xtq',
      password: 'h94pLnqUl02TqHdwAcQk',
      database: 'b0f8arjbbobjpsje6bub',
      entities: [],
      synchronize: true,
    }),
    UsersModule,
    PacienteModule,
    ConsultaModule,
    AuthModule,
  ],
})
export class AppModule {}