import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ValidationExceptionFilter } from './filters/validation_exception.filter';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  // app.useGlobalFilters(new ValidationExceptionFilter());
  await app.listen(3000);
  logger.log(`Application listening on port 3000`);
}
bootstrap();
