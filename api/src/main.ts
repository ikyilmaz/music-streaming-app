import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerOptions } from './configuration/swagger.configuration';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';

const logger: Logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set interceptors
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // Set global prefix
  app.setGlobalPrefix(`api/${process.env.API_VERSION}`);

  // Set pipes
  app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true,
    }),
  );

  // Set up swagger
  swaggerOptions(app);

  // Listen on port 8080
  await app.listen(process.env.PORT || 8080);

  logger.log('Başarılı bir şekilde başlatıldı.');
}
bootstrap();
