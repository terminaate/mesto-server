import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule, {cors: true});
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser())
  await app.listen(PORT, () =>
    console.log(`Server listening on http://127.0.0.1:${PORT}`),
  );
}

bootstrap();
