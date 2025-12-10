import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3030;
  // Enable CORS for frontend access
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Default Vite dev server
    credentials: true,
  });
  await app.listen(
    port,
    () => console.log(`MCP server is running on port ${port}`));
}
void bootstrap();
