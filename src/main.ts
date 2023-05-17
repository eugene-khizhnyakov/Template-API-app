import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { version } from '../package.json';
import { AppModule } from './app.module';
import { ConfigurationService } from './modules/configurations/configuration.service';

const configurationService = new ConfigurationService();

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, { cors: true });
  setupBaseConfigurations(app);
  setupSwagger(app);

  return app;
}

async function bootstrap(): Promise<void> {
  const app = await createApp();
  await app.listen(configurationService.get('APP_PORT'));
}

function setupSwagger(app: INestApplication): void {
  const swaggerOptions = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Documentation for API')
    .setVersion(version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);

  SwaggerModule.setup('/documentation', app, document);
}

function setupBaseConfigurations(app: INestApplication): void {
  const validationPipeOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  };
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
}

bootstrap();
