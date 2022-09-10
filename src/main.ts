import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: JSON.parse(process.env.CLIENT_URL),
      credentials: true,
    },
  });
  // Use global validation
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api', {
    exclude: [{ path: '/static/:path*', method: RequestMethod.GET }],
  });
  app.use(cookieParser());
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  await app.listen(PORT, () =>
    console.log(`Server listening on http://127.0.0.1:${PORT}`),
  );
}

bootstrap();
