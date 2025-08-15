"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  Image as ImageIcon, 
  Instagram, 
  Mail, 
  PlayCircle, 
  ShieldCheck, 
  Sparkles,
  Users,
  Clock,
  Award,
  TrendingUp,
  Building2
} from 'lucide-react';
import { detectPersona, getPersonaVariant, type RealtorPersona } from '@/lib/personaDetector';

function FakeCard({ title, icon: Icon, lines = [] as string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950 p-4">
      <div className="flex items-center gap-2 text-sm text-white/80">
        <Icon className="h-4 w-4" />
        <span>{title}</span>
      </div>
      <div className="mt-3 space-y-2 text-xs text-white/70">
        {lines.map((l, i) => (
          <div key={i} className="rounded-lg bg-white/5 px-3 py-2">
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

function FakeNote({ title, lines = [] as string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs font-semibold text-white/80">{title}</div>
      <ul className="mt-2 space-y-1 text-xs text-white/70 list-disc pl-4">
        {lines.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  );
}

function FakePhotoStack() {
  return (
    <div className="relative h-28">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />
      <div className="absolute inset-2 rounded-lg border border-white/10 bg-neutral-950" />
      <div className="absolute right-2 bottom-2 text-[10px] text-white/70 inline-flex items-center gap-1">
        <ImageIcon className="h-3 w-3" /> 12 photos
      </div>
    </div>
  );
}

// Persona-specific preview content
const getPersonaPreview = (persona: RealtorPersona) => {
  const previews = {
    new_agent: {
      note: { title: "MY FIRST LISTING", lines: ["Is my MLS description compliant?", "Am I missing anything?", "Does this sound professional?", "Help me get this right"] },
      cards: [
        { title: "MLS-Safe Description", icon: ClipboardList, lines: ["Compliant 3BR description…", "All fair housing approved"] },
        { title: "Professional Social", icon: Instagram, lines: ["Just Listed - looks legit!", "My first listing success"] },
        { title: "Confidence Builder", icon: Mail, lines: ["Subject: Professional Open House", "Sound experienced to clients"] }
      ]
    },
    experienced: {
      note: { title: "LISTING #47 THIS YEAR", lines: ["Need this faster", "Keep my voice", "Buyers love my style", "Same quality, less time"] },
      cards: [
        { title: "Brand-Consistent Copy", icon: ClipboardList, lines: ["Matches my proven style…", "Attracts my ideal buyers"] },
        { title: "Time-Saving Social", icon: Instagram, lines: ["Hook: My expertise shows", "CTA: Call the pro"] },
        { title: "Buyer Magnet Email", icon: Mail, lines: ["Subject: You'll want to see this", "Professional urgency created"] }
      ]
    },
    luxury: {
      note: { title: "$2.3M LUXURY LISTING", lines: ["Sophisticated language", "Preserve my brand", "Affluent buyer focus", "No generic copy"] },
      cards: [
        { title: "Luxury Description", icon: ClipboardList, lines: ["Sophisticated $2.3M prose…", "Preserves premium positioning"] },
        { title: "High-End Social", icon: Instagram, lines: ["Exclusive: Luxury unveiled", "Private showing inquiries only"] },
        { title: "Affluent Buyer Email", icon: Mail, lines: ["Subject: Exclusive opportunity", "Discretion and excellence"] }
      ]
    },
    volume: {
      note: { title: "15 NEW LISTINGS THIS MONTH", lines: ["Need speed + quality", "Templates that work", "Consistent results", "Scale my success"] },
      cards: [
        { title: "Quick Professional Copy", icon: ClipboardList, lines: ["Template #12 applied…", "Consistent quality maintained"] },
        { title: "Batch Social Content", icon: Instagram, lines: ["Variation A: Just listed", "Variation B: Open house"] },
        { title: "Efficient Email Templates", icon: Mail, lines: ["Subject: New listing alert", "Automated but personal"] }
      ]
    },
    team_leader: {
      note: { title: "TEAM BRAND CONSISTENCY", lines: ["All agents sound professional", "Brand standards maintained", "Quality control needed", "Scale team success"] },
      cards: [
        { title: "Brand-Compliant Copy", icon: ClipboardList, lines: ["Team template applied…", "Brand guidelines followed"] },
        { title: "Approved Social Content", icon: Instagram, lines: ["Team post: Professional look", "Brand colors and voice"] },
        { title: "Team Communication", icon: Mail, lines: ["Subject: [Team Brand] New Listing", "Consistent client experience"] }
      ]
    }
  };

  return previews[persona];
};

// Trust signals by persona
const getTrustSignals = (persona: RealtorPersona) => {
  const signals = {
    new_agent: [
      { icon: ShieldCheck, text: "MLS-compliant always" },
      { icon: Award, text: "Realtor-tested content" }, 
      { icon: Users, text: "Beginner-friendly" }
    ],
    experienced: [
      { icon: Clock, text: "10x faster workflow" },
      { icon: TrendingUp, text: "Used by 10K+ agents" },
      { icon: Award, text: "Maintains your voice" }
    ],
    luxury: [
      { icon: Award, text: "Luxury-focused AI" },
      { icon: ShieldCheck, text: "Brand-safe always" },
      { icon: Building2, text: "High-end tested" }
    ],
    volume: [
      { icon: TrendingUp, text: "Handles 100+ listings" },
      { icon: Clock, text: "Bulk processing ready" },
      { icon: Users, text: "Team-ready templates" }
    ],
    team_leader: [
      { icon: Users, text: "Team management tools" },
      { icon: ShieldCheck, text: "Brand control features" },
      { icon: Award, text: "Training included" }
    ]
  };

  return signals[persona];
};

interface Hero_v2Props {
  onScrollToDemo: () => void;
  onUseSample: () => void;
}

export default function Hero_v2({ onScrollToDemo, onUseSample }: Hero_v2Props) {
  const [persona, setPersona] = useState<RealtorPersona>('experienced');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Detect persona from URL and context
    const detected = detectPersona({
      url: window.location.pathname + window.location.search,
      // Add more detection context here from localStorage, user data, etc.
    });
    
    setPersona(detected.persona);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    // Show default while detecting
    return (
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-pulse">
            <div className="h-16 bg-white/10 rounded-lg mb-4"></div>
            <div className="h-6 bg-white/10 rounded-lg mb-6 w-3/4"></div>
            <div className="h-12 bg-white/10 rounded-lg w-48"></div>
          </div>
          <div className="h-96 bg-white/10 rounded-3xl animate-pulse"></div>
        </div>
      </section>
    );
  }

  const variant = getPersonaVariant(persona);
  const preview = getPersonaPreview(persona);
  const trustSignals = getTrustSignals(persona);

  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          {/* Persona indicator (for testing - can be hidden in production) */}
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-cyan-400/10 text-cyan-300 rounded-full text-xs">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            Optimized for {persona.replace('_', ' ')} agents
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight"
          >
            {variant.headline}
          </motion.h1>
          
          <p className="mt-5 text-lg text-white/80 max-w-2xl">
            {variant.subtext}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button 
              onClick={onScrollToDemo} 
              className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 font-semibold text-neutral-950 shadow-lg shadow-cyan-500/30 hover:opacity-95"
            >
              {variant.cta} →
            </button>
            <button 
              onClick={onUseSample} 
              className="text-white/80 hover:text-white underline underline-offset-4"
            >
              See a sample first
            </button>
          </div>

          {/* Dynamic trust signals based on persona */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/70">
            {trustSignals.map((signal, index) => (
              <span key={index} className="inline-flex items-center gap-2">
                <signal.icon className="h-4 w-4" /> {signal.text}
              </span>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="relative rounded-3xl p-1 bg-gradient-to-br from-cyan-500/40 via-blue-500/30 to-fuchsia-500/30">
            <div className="rounded-3xl bg-neutral-900 p-6">
              <div className="grid grid-cols-5 gap-3">
                <div className="col-span-2 space-y-3">
                  <FakeNote 
                    title={preview.note.title} 
                    lines={preview.note.lines} 
                  />
                  <FakePhotoStack />
                </div>
                <div className="col-span-3 space-y-3">
                  {preview.cards.map((card, index) => (
                    <FakeCard 
                      key={index}
                      title={card.title} 
                      icon={card.icon} 
                      lines={card.lines} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/60">
            Personalized for your agent type
          </div>
        </motion.div>
      </div>
    </section>
  );
}