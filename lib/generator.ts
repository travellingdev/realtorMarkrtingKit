import { z } from 'zod';

export const PayloadSchema = z.object({
  address: z.string().optional(),
  beds: z.string().optional(),
  baths: z.string().optional(),
  sqft: z.string().optional(),
  neighborhood: z.string().optional(),
  features: z.array(z.string()).optional(),
  tone: z.string().optional(),
  propertyType: z.string().optional(),
  brandVoice: z.string().optional(),
});
export type Payload = z.infer<typeof PayloadSchema>;

function trim(s: string) {
  return s.trim();
}

function cap(s: string, n: number) {
  if (s.length <= n) return s;
  const ellipsis = '…';
  return s.slice(0, Math.max(0, n - ellipsis.length)) + ellipsis;
}

export function generateOutputs(payload: Payload) {
  const addr = payload.address || '(address withheld)';
  const near = payload.neighborhood || 'the area';
  const features = payload.features?.slice(0, 6) || [];
  const featLine = features.length
    ? `Highlights: ${features.join(' • ')}. `
    : '';

  const baseDesc = `Sun-filled ${payload.beds || '?'}-bed, ${
    payload.baths || '?'
  }-bath${payload.sqft ? `, ${payload.sqft} sq ft` : ''} near ${near}. ${featLine}Moments to parks and cafés in ${near}.`;

  const mlsDesc = `${baseDesc}${
    payload.brandVoice ? `\n\nIn your voice: ${payload.brandVoice}` : ''
  }`;

  const igSlidesRaw = [
    `Just Listed in ${near} 🏡`,
    `${payload.beds || '?'} Bed • ${payload.baths || '?'} Bath$${
      payload.sqft ? ` • ${payload.sqft} sq ft` : ''
    }`.replace('$', ''),
    `Why it's special: ${
      features.slice(0, 3).join(', ') || 'light, flow, location'
    }`,
    `Open house: Sat 11–1 • ${addr}`,
    'DM "TOUR" for details',
  ];
  const igSlides = igSlidesRaw.map((s) => trim(cap(s, 110))).slice(0, 7);

  const reelRaw = [
    'Hook (0–3s): If natural light matters to you, watch this.',
    `Middle (4–20s): ${payload.beds || '?'} bd/${payload.baths || '?'} ba$${
      payload.sqft ? `, ${payload.sqft} sq ft` : ''
    }; open kitchen; ${
      features[0] || 'flex layout'
    }; primary suite; easy yard.`.replace('$', ''),
    `CTA (21–30s): Open house Sat 11–1 at ${addr}. Comment "TOUR" and I'll DM details.`,
  ];
  const reelScript = reelRaw.map((s) => trim(cap(s, 200))).slice(0, 3);

  const emailSubject = trim(cap(`Open House • ${near} ${payload.beds || '?'}BR`, 70));
  const emailBody = trim(
    cap(
      `Hi there,\n\nWe're opening the doors at ${addr}. Quick look:\n\n• ${
        payload.beds || '?'
      } bed / ${payload.baths || '?'} bath${
        payload.sqft ? ` • ${payload.sqft} sq ft` : ''
      }\n• ${
        features.slice(0, 4).join('\n• ') || 'Bright, functional, great location'
      }\n• Near ${near} amenities\n\nOpen House: Sat 11–1\nReply to RSVP or request the full photo tour.\n\nBest,\nYour Realtor`,
      900
    )
  );

  return {
    mlsDesc: trim(cap(mlsDesc, 900)),
    igSlides,
    reelScript,
    emailSubject,
    emailBody,
  };
}
