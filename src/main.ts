import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // <-- 1. IMPORTAR
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // 3. Especificar el tipo NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:9000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  await app.listen(3007);
}

bootstrap();
