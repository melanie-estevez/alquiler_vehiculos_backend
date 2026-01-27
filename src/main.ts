import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); 
  app.enableCors({
    origin: [
      'http://localhost:5173', 
      'http://localhost:3000', 
      'https://estevez-alquiler-vehiculos-api.desarrollo-software.xyz',

    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // si usas cookies/sesión
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.useStaticAssets(join(__dirname, '..', 'public'),
  {
    prefix: '/public'
  }

);
  await app.listen(3000);
}
bootstrap();