import { z } from 'zod';

export type BiotrackerInput = z.infer<typeof biotrackerSchema>;

export const biotrackerSchema = z.object({
  name: z.string().describe('Name of the biotracker (e.g., LDL Cholesterol)'),
  value: z.number().describe('Measured value'),
  unit: z.string().optional().describe('Measurement unit'),
  category: z
    .string()
    .optional()
    .describe('Category such as metabolic, cardiovascular, hormonal'),
  referenceRange: z
    .object({
      min: z.number(),
      max: z.number(),
    })
    .optional()
    .describe('Reference range for this biotracker'),
  status: z
    .enum(['normal', 'high', 'low'])
    .optional()
    .describe('Interpretation status if already known'),
});

export type AnalyzeInput = z.infer<typeof analyzeSchema>;
export const analyzeSchema = z.object({
  patientId: z.number().int(),
  patientName: z.string().optional(),
  biotrackers: z.array(biotrackerSchema).min(1),
});

export type SuggestInput = z.infer<typeof suggestSchema>;

export const suggestSchema = z.object({
  patientId: z.number().int(),
  focusCategories: z.array(z.string()).optional(),
  maxRecommendations: z.number().int().min(1).max(10).default(5),
  biotrackers: z.array(biotrackerSchema).optional(),
});
