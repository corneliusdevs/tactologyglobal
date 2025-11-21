import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { json, urlencoded } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || 3000;
  const isProd = configService.get<string>('NODE_ENV') === 'production';


  app.use(helmet()); // secure headers
  app.enableCors({
    origin: isProd ? configService.get<string>('CORS_ORIGIN') : '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });


  // Body parsing limits
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             // strip unknown properties
      forbidNonWhitelisted: true,  // throw error if extra fields
      transform: true,             // auto-transform payloads to DTOs
    }),
  );

  // Ready message
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Environment: ${isProd ? 'Production' : 'Development'}`);
}

bootstrap();
