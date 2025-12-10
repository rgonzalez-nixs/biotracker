import { Injectable, Logger } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import OpenAI from 'openai';
import { z } from 'zod';
import {
  type AnalyzeInput,
  biomarkerSchema,
  type SuggestInput,
  suggestSchema
} from './mcp-tools.model';

@Injectable()
export class McpTools {
  private readonly logger = new Logger(McpTools.name);
  private readonly openai: OpenAI | null = process.env.OPENAI_API_KEY?.length
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

  @Tool({
    name: 'analize_biomarkers',
    description:
      'RGiven patient biomarkers, highlight abnormalities, risk signals, and quick guidance.',
    parameters: z.object({
      patientId: z.number().int(),
      patientName: z.string().optional(),
      biomarkers: z.array(biomarkerSchema).min(1),
    }),
  })
  async analizeBiomarkers(input: AnalyzeInput) {
    const prompt = this.buildAnalyzePrompt(input);
    const text = await this.runPrompt(prompt);
    return {
      content: [{ type: 'text' as const, text }],
    };
  }

  @Tool({
    name: 'suggest_monitoring_priorities',
    description:
      'Propose priority biomarkers and follow-up cadence based on categories and current readings.',
    parameters: suggestSchema,
  })
  async suggestMonitoringPriorities(input: SuggestInput) {
    const prompt = this.buildSuggestionPrompt(input);
    const text = await this.runPrompt(prompt);
    return {
      content: [{ type: 'text' as const, text }],
    };
  }

  private buildAnalyzePrompt(input: AnalyzeInput): string {
    const lines = input.biomarkers
      .map((b) => {
        const range = b.referenceRange
          ? ` (ref ${b.referenceRange.min}-${b.referenceRange.max})`
          : '';
        const status = b.status ? ` [${b.status}]` : '';
        const cat = b.category ? ` | ${b.category}` : '';
        return `- ${b.name}${cat}: ${b.value}${b.unit ? ' ' + b.unit : ''}${range}${status}`;
      })
      .join('\n');

    return [
      `You are a clinical data assistant summarizing biomarker panels.`,
      `Patient ID: ${input.patientId}`,
      input.patientName ? `Patient Name: ${input.patientName}` : '',
      `Biomarkers:\n${lines}`,
      `Tasks:`,
      `1) Identify highs/lows and notable patterns.`,
      `2) Mention likely clinical significance briefly.`,
      `3) Provide 2-3 concise next-step suggestions (lifestyle, labs, or follow-up).`,
      `Keep it under 180 words.`,
    ]
      .filter(Boolean)
      .join('\n');
  }

  private buildSuggestionPrompt(input: SuggestInput): string {
    const focus = input.focusCategories?.length
      ? input.focusCategories.join(', ')
      : 'metabolic, cardiovascular, hormonal';
    const biomarkerLines = input.biomarkers?.length
      ? input.biomarkers
        .map((b) => {
          const cat = b.category ? ` (${b.category})` : '';
          const status = b.status ? ` [${b.status}]` : '';
          return `- ${b.name}${cat}: ${b.value}${b.unit ? ' ' + b.unit : ''}${status}`;
        })
        .join('\n')
      : 'None provided';

    return [
      `You are planning monitoring priorities for a patient.`,
      `Patient ID: ${input.patientId}`,
      `Focus categories: ${focus}`,
      `Biomarkers:\n${biomarkerLines}`,
      `Return up to ${input.maxRecommendations ?? 5} prioritized recommendations.`,
      `Each item: what to monitor, suggested cadence, and rationale in 1 sentence.`,
      `Keep total response under 150 words.`,
    ].join('\n');
  }

  private async runPrompt(prompt: string): Promise<string> {
    if (!this.openai) {
      this.logger.warn('OPENAI_API_KEY not set; returning heuristic response');
      return 'OpenAI key not configured. Please set OPENAI_API_KEY to enable LLM-backed analysis.';
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 350,
      });

      const text =
        response.choices?.[0]?.message?.content ??
        'No content returned from OpenAI completion.';

      return text.trim();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`OpenAI completion failed: ${message}`);
      return 'Error generating analysis. Check logs and OpenAI configuration.';
    }
  }
}
