import { test, expect } from '@playwright/test';
import { uploadPhotos } from '@/lib/uploadPhotos';
import { buildPayloadFromForm } from '@/lib/payloadBuilder';
import { generateOutputs } from '@/lib/generator';

// minimal stub for Supabase storage
function makeStub() {
  const uploaded: string[] = [];
  const storage = {
    from: (_bucket: string) => ({
      upload: async (path: string, _file: File) => {
        uploaded.push(path);
        return { data: { path }, error: null };
      },
      getPublicUrl: (path: string) => ({ data: { publicUrl: `https://cdn.example.com/${path}` } }),
    }),
  } as any;
  return { sb: { storage }, uploaded };
}

test('photos uploaded and appear in outputs', async () => {
  const files = [
    new File(['a'], 'front.jpg'),
    new File(['b'], 'kitchen.png'),
  ];
  const { sb, uploaded } = makeStub();
  const urls = await uploadPhotos(sb, files, 'user1');
  expect(uploaded).toEqual(['user1/0-front.jpg', 'user1/1-kitchen.png']);
  expect(urls).toEqual([
    'https://cdn.example.com/user1/0-front.jpg',
    'https://cdn.example.com/user1/1-kitchen.png',
  ]);

  const { payload, controls } = buildPayloadFromForm({
    address: '123 Main St',
    beds: '3',
    baths: '2',
    sqft: '',
    neighborhood: '',
    features: '',
    photos: urls,
    propertyType: '',
    tone: '',
    brandVoice: '',
    channels: [],
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
  expect(payload.photos).toEqual(urls);
  const outputs = generateOutputs(payload, controls);
  expect(outputs.emailBody).toContain(urls[0]);
});
