import { Module } from '@nestjs/common';
import { McpModule } from '@rekog/mcp-nest';
import { McpTools } from './mcp-tools/mcp-tools.tools';

@Module({
  imports: [
    McpModule.forRoot({
      name: 'biotracker-mcp',
      version: '0.0.1',
    }),
  ],
  providers: [McpTools],
})
export class AppModule {}
