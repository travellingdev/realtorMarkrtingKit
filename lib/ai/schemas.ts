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
  mlsDesc: z.string().default(''),
  igSlides: z.array(z.string()).default([]),
  igHashtags: z.object({  // NEW: Instagram hashtags with categories
    trending: z.array(z.string()).default([]),
    location: z.array(z.string()).default([]),
    features: z.array(z.string()).default([]),
    targeted: z.array(z.string()).default([]),
    content: z.array(z.string()).default([]), // Content-aware hashtags from actual text
    all: z.array(z.string()).default([]), // Combined list for easy copying
    score: z.number().optional(),
    tips: z.string().optional()
  }).optional(),
  reelScript: z.array(z.string()).default([]),
  reelHooks: z.array(z.string()).default([]), // Alternative hooks for A/B testing
  emailSubject: z.string().default(''),
  emailBody: z.string().default(''),
});
export type Output = z.infer<typeof OutputSchema>;

// JSON schema used for OpenAI's `response_format=json_schema` option.
export const OutputJsonSchema = {
  type: 'object',
  properties: {
    mlsDesc: { type: 'string' },
    igSlides: { type: 'array', items: { type: 'string' } },
    igHashtags: { 
      type: 'object',
      properties: {
        trending: { type: 'array', items: { type: 'string' } },
        location: { type: 'array', items: { type: 'string' } },
        features: { type: 'array', items: { type: 'string' } },
        targeted: { type: 'array', items: { type: 'string' } },
        content: { type: 'array', items: { type: 'string' } },
        all: { type: 'array', items: { type: 'string' } },
        score: { type: 'number' },
        tips: { type: 'string' }
      },
      required: ['trending', 'location', 'features', 'targeted', 'content', 'all']
    },
    reelScript: { type: 'array', items: { type: 'string' } },
    reelHooks: { type: 'array', items: { type: 'string' } },
    emailSubject: { type: 'string' },
    emailBody: { type: 'string' },
  },
  required: ['mlsDesc', 'igSlides', 'reelScript', 'emailSubject', 'emailBody'],
  additionalProperties: false,
} as const;

