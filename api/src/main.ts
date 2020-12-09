import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerOptions } from './configuration/swagger.configuration';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';

const logger: Logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Interceptor middleware
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // Global prefix
  app.setGlobalPrefix(`api/${process.env.API_VERSION}`);

  // Validasyon için gerekli 
  app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true,
    }),
  );

  // Swaggerı yükle
  swaggerOptions(app);

  // ve port 8080'de dinlemeye başla
  await app.listen(process.env.PORT || 8080);

  logger.log('Başarılı bir şekilde başlatıldı.');
}
bootstrap();
