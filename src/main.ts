import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Documentation FOOD API')
    .setDescription('Api for FOOD')
    .setVersion('1.0')
    .addTag('App', 'App endpoints')
    .addTag('Product', 'Products endpoints')
    .addTag('User', 'User endpoints')
    .addTag('Auth', 'Auth endpoints')
    .addTag('Cart', 'Cart endpoints')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
