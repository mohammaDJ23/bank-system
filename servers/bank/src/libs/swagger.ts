import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function swagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Auth apis')
    .setDescription('The apis of the auth service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('auth', app, document);
}
