import { z } from 'zod';

// Core facts about the property used by the model.
export const FactsSchema = z.object({
  address: z.string().optional(),
  neighborhood: z.string().optional(),
  beds: z.string().optional(),
  baths: z.string().optional(),
  sqft: z.string().optional(),
  features: z.array(z.string()).default([]),
  propertyType: z.string().optional(),
  tone: z.string().optional(),
  brandVoice: z.string().optional(),
});
export type Facts = z.infer<typeof FactsSchema>;

// Controls for generation. Currently just the subscription plan but leaves
// room for future knobs.
export const ControlsSchema = z.object({
  plan: z.enum(['FREE', 'PRO', 'TEAM']).default('FREE'),
});
export type Controls = z.infer<typeof ControlsSchema>;

// Expected marketing outputs from the model.
export const OutputSchema = z.object({
  mlsDesc: z.string(),
  igSlides: z.array(z.string()),
  reelScript: z.array(z.string()),
  emailSubject: z.string(),
  emailBody: z.string(),
});
export type Output = z.infer<typeof OutputSchema>;

// JSON schema used for OpenAI's `response_format=json_schema` option.
export const OutputJsonSchema = {
  type: 'object',
  properties: {
    mlsDesc: { type: 'string' },
    igSlides: { type: 'array', items: { type: 'string' } },
    reelScript: { type: 'array', items: { type: 'string' } },
    emailSubject: { type: 'string' },
    emailBody: { type: 'string' },
  },
  required: ['mlsDesc', 'igSlides', 'reelScript', 'emailSubject', 'emailBody'],
  additionalProperties: false,
} as const;

