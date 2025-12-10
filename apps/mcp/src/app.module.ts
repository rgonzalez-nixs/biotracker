import { Module } from '@nestjs/common';
import { McpModule } from '@rekog/mcp-nest';
import { McpTools } from './mcp-tools/mcp-tools.tools';
import { McpToolsController } from './mcp-tools/mcp-tools.controller';

@Module({
  imports: [
    McpModule.forRoot({
      name: 'biotracker-mcp',
      version: '0.0.1',
    }),
  ],
  controllers: [McpToolsController],
  providers: [McpTools],
})
export class AppModule {}
