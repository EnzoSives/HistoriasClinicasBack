import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    // origin: 'https://secretariamadariaga-799ec.web.app',
    origin: 'http://149.50.137.224:5173/',
    // origin: 'http://localhost:5173/',
     // Reemplaza con el origen de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
 

  await app.listen(3000);
}

bootstrap();

