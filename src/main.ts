import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://lumi.desarrollo-software.xyz',
      'https://estevez-alquiler-vehiculos-api.desarrollo-software.xyz',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/public' });
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  await app.listen(3000);
}
bootstrap();
