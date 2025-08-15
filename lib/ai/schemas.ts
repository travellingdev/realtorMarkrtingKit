import { z } from 'zod';

// Core facts about the property used by the model.
export const FactsSchema = z.object({
  address: z.string().optional(),
  neighborhood: z.string().optional(),
  beds: z.string().optional(),
  baths: z.string().optional(),
  sqft: z.string().optional(),
  features: z.array(z.string()).default([]),
  photos: z.array(z.string()).default([]),
  propertyType: z.string().optional(),
  tone: z.string().optional(),
  brandVoice: z.string().optional(),
  summary: z.string().optional(),
});
export type Facts = z.infer<typeof FactsSchema>;

// Controls for generation. Currently just the subscription plan but leaves
// room for future knobs.
export const ControlsSchema = z.object({
  plan: z.enum(['FREE', 'PRO', 'TEAM']).default('FREE'),
  channels: z.array(z.string()).default([]),
  openHouseDate: z.string().optional(),
  openHouseTime: z.string().optional(),
  openHouseLink: z.string().optional(),
  ctaType: z.string().optional(),
  ctaPhone: z.string().optional(),
  ctaLink: z.string().optional(),
  ctaCustom: z.string().optional(),
  socialHandle: z.string().optional(),
  hashtagStrategy: z.string().optional(),
  extraHashtags: z.string().optional(),
  readingLevel: z.string().optional(),
  useEmojis: z.boolean().default(false),
  mlsFormat: z.string().optional(),
  policy: z
    .object({
      mustInclude: z.array(z.string()).default([]),
      avoidWords: z.array(z.string()).default([]),
    })
    .default({ mustInclude: [], avoidWords: [] }),
});
export type Controls = z.infer<typeof ControlsSchema>;

// Expected marketing outputs from the model.
export const OutputSchema = z.object({
  mlsDesc: z.string().min(1),
  igSlides: z.array(z.string().min(1)).min(5).max(7),
  reelScript: z
    .array(
      z.object({
        shot: z.string().min(1),
        text: z.string().min(1),
        voice: z.string().min(1),
      })
    )
    .length(3),
  emailSubject: z.string().min(1),
  emailBody: z.string().min(1),
});
export type Output = z.infer<typeof OutputSchema>;

// JSON schema used for OpenAI's `response_format=json_schema` option.
export const OutputJsonSchema = {
  type: 'object',
  properties: {
    mlsDesc: { type: 'string', minLength: 1 },
    igSlides: {
      type: 'array',
      items: { type: 'string', minLength: 1 },
      minItems: 5,
      maxItems: 7,
    },
    reelScript: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          shot: { type: 'string', minLength: 1 },
          text: { type: 'string', minLength: 1 },
          voice: { type: 'string', minLength: 1 },
        },
        required: ['shot', 'text', 'voice'],
        additionalProperties: false,
      },
      minItems: 3,
      maxItems: 3,
    },
    emailSubject: { type: 'string', minLength: 1 },
    emailBody: { type: 'string', minLength: 1 },
  },
  required: ['mlsDesc', 'igSlides', 'reelScript', 'emailSubject', 'emailBody'],
  additionalProperties: false,
} as const;

