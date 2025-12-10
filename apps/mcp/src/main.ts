import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3030;
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  await app.listen(
    port,
    () => console.log(`MCP server is running on port ${port}`));
}
void bootstrap();
