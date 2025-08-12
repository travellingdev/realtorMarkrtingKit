import { test, expect } from '@playwright/test';
import { buildPayloadFromForm } from '@/lib/payloadBuilder';
import { ControlsSchema } from '@/lib/ai/schemas';
import { generateOutputs } from '@/lib/generator';

test('controls survive validation and influence output', () => {
  const { payload, controls } = buildPayloadFromForm({
    address: '123 Main St',
    beds: '3',
    baths: '2',
    sqft: '1500',
    neighborhood: 'Downtown',
    features: 'garage,pool',
    photos: [],
    propertyType: 'House',
    tone: 'Friendly',
    brandVoice: 'Casual',
    channels: ['mls', 'email', 'instagram'],
    openHouseDate: 'July 4',
    openHouseTime: '1-3pm',
    openHouseLink: 'http://openhouse',
    ctaType: 'phone',
    ctaPhone: '555-1234',
    ctaLink: '',
    ctaCustom: '',
    socialHandle: '@realtor',
    hashtagStrategy: 'local',
    extraHashtags: '#sale',
    readingLevel: '8th',
    useEmojis: true,
    mlsFormat: 'standard',
    mustInclude: '',
    avoidWords: '',
  });

  const parsed = ControlsSchema.parse(controls);
  const outputs = generateOutputs(payload, parsed);

  expect(outputs.mlsDesc).toContain('July 4');
  expect(outputs.mlsDesc).toContain('8th');
  expect(outputs.mlsDesc).toContain('standard');
  expect(outputs.mlsDesc).toContain('😊');
  expect(outputs.emailBody).toContain('Call 555-1234');
  const lastSlide = outputs.igSlides[outputs.igSlides.length - 1];
  expect(lastSlide).toContain('@realtor');
  expect(lastSlide).toContain('#local');
  expect(lastSlide).toContain('#sale');
});

test('channels filter outputs', () => {
  const { payload, controls } = buildPayloadFromForm({
    address: '123 Main St',
    beds: '3',
    baths: '2',
    sqft: '1500',
    neighborhood: 'Downtown',
    features: '',
    photos: [],
    propertyType: '',
    tone: '',
    brandVoice: '',
    channels: ['mls'],
    openHouseDate: '',
    openHouseTime: '',
    openHouseLink: '',
    ctaType: '',
    ctaPhone: '',
    ctaLink: '',
    ctaCustom: '',
    socialHandle: '',
    hashtagStrategy: '',
    extraHashtags: '',
    readingLevel: '',
    useEmojis: false,
    mlsFormat: '',
    mustInclude: '',
    avoidWords: '',
  });

  const parsed = ControlsSchema.parse(controls);
  const outputs = generateOutputs(payload, parsed);
  expect(outputs.igSlides).toHaveLength(0);
  expect(outputs.reelScript).toHaveLength(0);
  expect(outputs.emailSubject).toBe('');
  expect(outputs.emailBody).toBe('');
  expect(outputs.mlsDesc).not.toBe('');
});
