import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors({
    origin: ['http://localhost:3000', 'http://167.235.140.175:3000'],
    methods: 'GET,POST,PATCH,DELETE',
    credentials: true,
  });

  await app.listen(3001, '0.0.0.0');
}
void bootstrap();
