import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  //*CONFIGURACIÓN DEL VALIDATON
  //La configuración de whitelist: true, nos permite que las propiedades que no son validadas
  //no entren a nuestro backend, es decir que lolo las propiedades con decorador de validación
  //podrán entrar a nuestro backend. Es una forma para ser mas estricto. En caso contemos con una
  //propiedad que no requiera validación debemos decorarlo con @Allow
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      //Con esto nos aseguramos que se conviertan automaticamente los tipos que entren al backend
      //Permitiendo que los tipos sea siempre correctos mientras su conversión sea posible
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  //*Swagger config
  const config = new DocumentBuilder()
    .setTitle('CMGarmentsApi')
    .setDescription('La api de la tienda de prendas CMGarments')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
