import type { Payload } from '@/lib/generator';
import type { Controls } from '@/lib/ai/schemas';

export function buildPayloadFromForm({
  address,
  beds,
  baths,
  sqft,
  neighborhood,
  features,
  photos,
  propertyType,
  tone,
  brandVoice,
  channels,
  openHouseDate,
  openHouseTime,
  openHouseLink,
  ctaType,
  ctaPhone,
  ctaLink,
  ctaCustom,
  socialHandle,
  hashtagStrategy,
  extraHashtags,
  readingLevel,
  useEmojis,
  mlsFormat,
  mustInclude,
  avoidWords,
  // New enhanced fields
  mlsCompliance,
  targetAudience,
  challenges,
  priorityFeatures,
  
  // Additional v3 enhanced fields
  schoolDistrict,
  walkScore,
  distanceToDowntown,
  nearbyAmenities,
  mlsLength,
  emailLength,
  socialLength,
}: {
  address: string;
  beds: string;
  baths: string;
  sqft: string;
  neighborhood: string;
  features: string;
  photos: string[];
  propertyType: string;
  tone: string;
  brandVoice: string;
  channels: string[];
  openHouseDate: string;
  openHouseTime: string;
  openHouseLink: string;
  ctaType: string;
  ctaPhone: string;
  ctaLink: string;
  ctaCustom: string;
  socialHandle: string;
  hashtagStrategy: string;
  extraHashtags: string;
  readingLevel: string;
  useEmojis: boolean;
  mlsFormat: string;
  mustInclude: string;
  avoidWords: string;
  // New enhanced fields
  mlsCompliance?: string;
  targetAudience?: string[];
  challenges?: string[];
  priorityFeatures?: Array<{ id: string; value: string; priority: number }>;
  
  // Additional v3 enhanced fields
  schoolDistrict?: string;
  walkScore?: string;
  distanceToDowntown?: string;
  nearbyAmenities?: string[];
  mlsLength?: number;
  emailLength?: number;
  socialLength?: number;
}): { payload: Payload; controls: Partial<Controls> } {
  const toStr = (v: string) => (v?.trim() ? v.trim() : undefined);
  
  // Handle both old comma-separated features and new priority features
  let featureList: string[] = [];
  if (priorityFeatures && priorityFeatures.length > 0) {
    // Use priority features if available, sorted by priority
    featureList = priorityFeatures
      .sort((a, b) => a.priority - b.priority)
      .map(f => f.value)
      .filter(Boolean);
  } else if (features) {
    // Fallback to comma-separated features
    featureList = features
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);
  }

  const payload: Payload = {
    address: toStr(address),
    beds: toStr(beds),
    baths: toStr(baths),
    sqft: toStr(sqft),
    neighborhood: toStr(neighborhood),
    features: featureList.length ? featureList : undefined,
    photos: photos && photos.length ? photos : undefined,
    tone: toStr(tone),
    propertyType: toStr(propertyType),
    brandVoice: toStr(brandVoice),
    
    // New enhanced fields
    mlsCompliance: toStr(mlsCompliance || ''),
    targetAudience: targetAudience && targetAudience.length ? targetAudience : undefined,
    challenges: challenges && challenges.length ? challenges : undefined,
    priorityFeatures: priorityFeatures && priorityFeatures.length ? priorityFeatures : undefined,
    
    // Additional v3 enhanced fields
    schoolDistrict: toStr(schoolDistrict || ''),
    walkScore: toStr(walkScore || ''),
    distanceToDowntown: toStr(distanceToDowntown || ''),
    nearbyAmenities: nearbyAmenities && nearbyAmenities.length ? nearbyAmenities : undefined,
  };
  const controls: Partial<Controls> = {
    channels: channels && channels.length ? channels : undefined,
    openHouseDate: toStr(openHouseDate),
    openHouseTime: toStr(openHouseTime),
    openHouseLink: toStr(openHouseLink),
    ctaType: toStr(ctaType),
    ctaPhone: toStr(ctaPhone),
    ctaLink: toStr(ctaLink),
    ctaCustom: toStr(ctaCustom),
    socialHandle: toStr(socialHandle),
    hashtagStrategy: toStr(hashtagStrategy),
    extraHashtags: toStr(extraHashtags),
    readingLevel: toStr(readingLevel),
    useEmojis: useEmojis ? true : undefined,
    mlsFormat: toStr(mlsFormat),
    policy: {
      mustInclude: mustInclude
        .split(',')
        .map((w) => w.trim())
        .filter(Boolean),
      avoidWords: avoidWords
        .split(',')
        .map((w) => w.trim())
        .filter(Boolean),
    },
  };
  return { payload, controls };
}


