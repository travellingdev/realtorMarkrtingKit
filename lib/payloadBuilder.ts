import type { Payload } from '@/lib/generator';

export function buildPayloadFromForm({
  address,
  beds,
  baths,
  sqft,
  neighborhood,
  features,
  propertyType,
  tone,
  brandVoice,
}: {
  address: string;
  beds: string;
  baths: string;
  sqft: string;
  neighborhood: string;
  features: string;
  propertyType: string;
  tone: string;
  brandVoice: string;
}): Payload {
  const toStr = (v: string) => (v?.trim() ? v.trim() : undefined);
  const featureList = features
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean);

  const payload: Payload = {
    address: toStr(address),
    beds: toStr(beds),
    baths: toStr(baths),
    sqft: toStr(sqft),
    neighborhood: toStr(neighborhood),
    features: featureList.length ? featureList : undefined,
    tone: toStr(tone),
    propertyType: toStr(propertyType),
    brandVoice: toStr(brandVoice),
  };
  return payload;
}


