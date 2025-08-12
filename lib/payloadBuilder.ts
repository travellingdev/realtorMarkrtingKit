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
}): { payload: Payload; controls: Partial<Controls> } {
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
    photos: photos && photos.length ? photos : undefined,
    tone: toStr(tone),
    propertyType: toStr(propertyType),
    brandVoice: toStr(brandVoice),
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


