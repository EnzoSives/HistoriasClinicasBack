import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    // origin: 'https://secretariamadariaga-799ec.web.app',
    // origin: 'http://149.50.142.190:5173/',
    origin: '*',
     // Reemplaza con el origen de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
 

  await app.listen(3000);
}

bootstrap();

