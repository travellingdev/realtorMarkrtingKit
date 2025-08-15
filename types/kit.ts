import type { Payload } from '@/lib/generator';

export type { Payload };

export type Outputs = {
  mlsDesc: string;
  igSlides: string[];
  reelScript: { shot: string; text: string; voice: string }[];
  emailSubject: string;
  emailBody: string;
};


