import { INestApplication } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from '../modules/auth/auth.module';

export const swaggerOptions = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .addSecurity('basic', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .setTitle('Music Streaming App')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [AuthModule],
  });
  SwaggerModule.setup('/api', app, document);
};
