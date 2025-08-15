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

// Reel segment structure for enforced format
export const ReelSegmentSchema = z.object({
  time: z.enum(['[0-3s]', '[4-10s]', '[11-20s]', '[21-30s]']),
  voice: z.string().min(1).max(200),
  text: z.string().min(1).max(40),
  shot: z.string().min(1).max(100)
});
export type ReelSegment = z.infer<typeof ReelSegmentSchema>;

// Email structure for consistent generation
export const EmailStructureSchema = z.object({
  subject: z.string().min(10).max(60),
  greeting: z.string().default('Hi there'),
  hook: z.string().min(10).max(200),
  valuePoints: z.array(z.string()).length(3),
  urgency: z.string().min(5).max(150),
  ctaPrimary: z.string().min(3).max(50),
  ctaSecondary: z.string().default('Reply with questions'),
  signature: z.string()
});
export type EmailStructure = z.infer<typeof EmailStructureSchema>;

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
  reelScript: z.union([
    z.array(ReelSegmentSchema).length(4), // New structured format
    z.array(z.string()) // Legacy string format for backwards compatibility
  ]).default([]),
  reelHooks: z.array(z.string()).default([]), // Alternative hooks for A/B testing
  emailSubject: z.string().default(''),
  emailBody: z.string().default(''),
  emailStructured: EmailStructureSchema.optional(), // New structured email format
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
    reelScript: { 
      type: 'array', 
      items: { 
        type: 'object',
        properties: {
          time: { 
            type: 'string',
            enum: ['[0-3s]', '[4-10s]', '[11-20s]', '[21-30s]']
          },
          voice: { 
            type: 'string',
            minLength: 1,
            maxLength: 200,
            description: 'What the agent says - full voiceover script'
          },
          text: { 
            type: 'string',
            minLength: 1,
            maxLength: 40,
            description: 'On-screen text - ultra-short, readable without sound'
          },
          shot: { 
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'Camera direction or visual element'
          }
        },
        required: ['time', 'voice', 'text', 'shot'],
        additionalProperties: false
      },
      minItems: 4,
      maxItems: 4,
      description: 'Exactly 4 segments for 30-second reel'
    },
    reelHooks: { type: 'array', items: { type: 'string' } },
    emailSubject: { type: 'string' },
    emailBody: { type: 'string' },
    emailStructured: {
      type: 'object',
      properties: {
        subject: { 
          type: 'string',
          minLength: 10,
          maxLength: 60,
          description: 'Email subject line with best available detail'
        },
        greeting: { 
          type: 'string',
          description: 'Email greeting - Hi there or Hi [Name]'
        },
        hook: { 
          type: 'string',
          minLength: 10,
          maxLength: 200,
          description: 'Opening sentence that creates desire'
        },
        valuePoints: { 
          type: 'array',
          items: { type: 'string' },
          minItems: 3,
          maxItems: 3,
          description: 'Exactly 3 value points about the property'
        },
        urgency: { 
          type: 'string',
          minLength: 5,
          maxLength: 150,
          description: 'Authentic reason to act now'
        },
        ctaPrimary: { 
          type: 'string',
          minLength: 3,
          maxLength: 50,
          description: 'Primary call to action'
        },
        ctaSecondary: { 
          type: 'string',
          description: 'Secondary CTA - usually Reply with questions'
        },
        signature: { 
          type: 'string',
          description: 'Professional email signature'
        }
      },
      required: ['subject', 'greeting', 'hook', 'valuePoints', 'urgency', 'ctaPrimary', 'ctaSecondary', 'signature'],
      additionalProperties: false
    }
  },
  required: ['mlsDesc', 'igSlides', 'reelScript', 'emailSubject', 'emailBody'],
  additionalProperties: false,
} as const;

