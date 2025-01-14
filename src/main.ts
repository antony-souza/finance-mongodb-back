import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { environment } from './environment/environment';
import { connectedRedis } from './providers/redis/redis.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalGuards();

  await app.listen(environment.port);
  new Logger().debug(`Server running on ${environment.port}`, 'Aplication');
  await connectedRedis();
}
bootstrap();
