import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { analyzeSchema, suggestSchema } from './mcp-tools.model';
import { McpTools } from './mcp-tools.tools';

@Controller('mcp')
export class McpToolsController {
    constructor(private readonly mcpTools: McpTools) { }

    @Post('analize-biotrackers')
    @HttpCode(HttpStatus.OK)
    async analizeBiotrackers(@Body() body: unknown) {
        const validated = analyzeSchema.safeParse(body);
        if (!validated.success) {
            return {
                success: false,
                error: validated.error.message,
            };
        }
        const result = await this.mcpTools.analizeBiotrackers(validated.data);
        const textContent =
            result.content?.[0]?.type === 'text'
                ? result.content[0].text
                : JSON.stringify(result);
        return {
            success: true,
            text: textContent,
            raw: result,
        };
    }

    @Post('suggest-monitoring-priorities')
    @HttpCode(HttpStatus.OK)
    async suggestMonitoringPriorities(@Body() body: unknown) {
        const validated = suggestSchema.safeParse(body);
        if (!validated.success) {
            return {
                success: false,
                error: validated.error.message,
            };
        }
        const result = await this.mcpTools.suggestMonitoringPriorities(validated.data);
        const textContent =
            result.content?.[0]?.type === 'text'
                ? result.content[0].text
                : JSON.stringify(result);
        return {
            success: true,
            text: textContent,
            raw: result,
        };
    }
}
