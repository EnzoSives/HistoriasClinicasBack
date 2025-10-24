import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // <-- 1. IMPORTAR
import { join } from 'path'; // <-- 2. IMPORTAR

async function bootstrap() {
  // 3. Especificar el tipo NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
 
  // 4. Servir archivos estáticos desde la carpeta 'uploads'
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Las imágenes estarán disponibles en http://.../uploads/nombre_archivo.jpg
    index: false // Disable automatic index.html lookup
  });

  await app.listen(3000);
}

bootstrap();
