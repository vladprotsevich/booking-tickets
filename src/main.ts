import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { migrate } from './db/knexfile';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await migrate();
  await app.listen(3000);
}
bootstrap();
