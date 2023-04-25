import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { ValidationPipe } from './pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configSwagger = new DocumentBuilder()
    .setTitle('Nest Mongo api')
    .setDescription('Base version of api')
    .setVersion('1.0.0')
    .addTag('BackEnd')
    .build()

  const document = SwaggerModule.createDocument(app, configSwagger)
  SwaggerModule.setup('/api/docs', app, document)

  app.useGlobalPipes(new ValidationPipe());

  const config = new ConfigService();
  await app.listen(await config.getPortConfig());
}
bootstrap();
