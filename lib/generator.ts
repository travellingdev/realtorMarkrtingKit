import { z } from 'zod';
import type { Controls } from '@/lib/ai/schemas';

export const PayloadSchema = z.object({
  address: z.string().optional(),
  beds: z.string().optional(),
  baths: z.string().optional(),
  sqft: z.string().optional(),
  neighborhood: z.string().optional(),
  features: z.array(z.string()).optional(),
  photos: z.array(z.string()).optional(),
  tone: z.string().optional(),
  propertyType: z.string().optional(),
  brandVoice: z.string().optional(),
  
  // New enhanced fields
  mlsCompliance: z.string().optional(),
  targetAudience: z.array(z.string()).optional(),
  challenges: z.array(z.string()).optional(),
  priorityFeatures: z.array(z.object({
    id: z.string(),
    value: z.string(),
    priority: z.number(),
  })).optional(),
  
  // Additional v3 enhanced fields
  schoolDistrict: z.string().optional(),
  walkScore: z.string().optional(),
  distanceToDowntown: z.string().optional(),
  nearbyAmenities: z.array(z.string()).optional(),
});

export type Payload = z.infer<typeof PayloadSchema>;

export function generateOutputs(
  payload: Payload,
  controls: Partial<Controls> = {}
) {
  const addr = payload.address || '(address withheld)';
  const near = payload.neighborhood || 'the area';
  const features = payload.features?.slice(0, 6) || [];
  const featLine = features.length
    ? `Highlights: ${features.join(' \u2022 ')}. `
    : '';
  let mlsDesc = `Sun-filled ${payload.beds || '?'}-bed, ${
    payload.baths || '?'
  }-bath${payload.sqft ? `, ${payload.sqft} sq ft` : ''} near ${near}. ${
    featLine
  }Moments to parks and cafés in ${near}.`;

  if (
    controls.openHouseDate ||
    controls.openHouseTime ||
    controls.openHouseLink
  ) {
    const parts = [
      controls.openHouseDate,
      controls.openHouseTime,
      controls.openHouseLink,
    ].filter(Boolean);
    mlsDesc += ` Open house: ${parts.join(' ')}`;
  }

  if (controls.readingLevel) {
    mlsDesc += ` [reading:${controls.readingLevel}]`;
  }

  if (controls.mlsFormat) {
    mlsDesc = `[${controls.mlsFormat}] ${mlsDesc}`;
  }

  if (controls.useEmojis) {
    mlsDesc += ' \uD83D\uDE0A';
  }

  const channels = new Set(controls.channels || []);
  const include = (name: string) => channels.size === 0 || channels.has(name);

  const outputs = {
    mlsDesc: include('mls') ? mlsDesc : '',
    igSlides: include('instagram')
      ? [
          `Just Listed in ${near}`,
          `${payload.beds || '?'} Bed \u2022 ${payload.baths || '?'} Bath${
            payload.sqft ? ` \u2022 ${payload.sqft} sq ft` : ''
          }`,
          `Why it's special: ${
            features.slice(0, 3).join(', ') || 'light, flow, location'
          }`,
        ]
      : [],
    reelScript: include('reels')
      ? [
          `Hook: If natural light matters to you, watch this.`,
          `Middle: ${payload.beds || '?'} bd/${payload.baths || '?'} ba${
            payload.sqft ? `, ${payload.sqft} sq ft` : ''
          }.`,
          `CTA: See more at ${addr}.`,
        ]
      : [],
    emailSubject: include('email')
      ? `Open House \u2022 ${near} ${payload.beds || '?'}BR`
      : '',
    emailBody: include('email')
      ? `Hi there,\n\nWe're opening the doors at ${addr}.\n\n` +
        `Quick look:\n` +
        `• ${payload.beds || '?'} bed / ${payload.baths || '?'} bath${payload.sqft ? ` • ${payload.sqft} sq ft` : ''}\n` +
        `• ${features.length ? features.slice(0, 3).join('\n• ') : 'Great location and condition'}\n` +
        `• Near ${near} amenities\n\n` +
        `Open House: Saturday 11-1\n` +
        `Reply to RSVP or request the full photo tour.\n\n` +
        `Best,\nYour Realtor`
      : '',
  };

  if (include('instagram') && controls.socialHandle) {
    let hashtags = '';
    if (controls.hashtagStrategy) hashtags += ` #${controls.hashtagStrategy}`;
    if (controls.extraHashtags) hashtags += ` ${controls.extraHashtags}`;
    outputs.igSlides.push(`Follow ${controls.socialHandle}${hashtags}`.trim());
  }

  if (include('email')) {
    let cta = '';
    if (controls.ctaType === 'phone' && controls.ctaPhone)
      cta = `Call ${controls.ctaPhone}`;
    else if (controls.ctaType === 'link' && controls.ctaLink)
      cta = `Visit ${controls.ctaLink}`;
    else if (controls.ctaType === 'custom' && controls.ctaCustom)
      cta = controls.ctaCustom;
    if (cta) outputs.emailBody += `\n\n${cta}`;
  }

  return outputs;
}

