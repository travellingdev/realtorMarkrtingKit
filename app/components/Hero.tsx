"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Image as ImageIcon, Instagram, Mail, PlayCircle, ShieldCheck, Sparkles } from 'lucide-react';

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

export default function Hero({ onScrollToDemo, onUseSample }:{ onScrollToDemo: ()=>void; onUseSample: ()=>void }) {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight"
          >
            Turn 2 hours of listing copy into 2 minutes.
          </motion.h1>
          <p className="mt-5 text-lg text-white/80 max-w-2xl">
            Paste the basics; get <span className="font-semibold">MLS-safe</span> descriptions, Instagram captions + <span className="font-semibold">30-sec reel scripts</span>, and open-house emails — consistent with your brand voice.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button onClick={onScrollToDemo} className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 font-semibold text-neutral-950 shadow-lg shadow-cyan-500/30 hover:opacity-95">
              Generate My First Kit →
            </button>
            <button onClick={onUseSample} className="text-white/80 hover:text-white underline underline-offset-4">
              Try a sample (no signup)
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> MLS-safe phrasing
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Realtor-tested outputs
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> No credit card
            </span>
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
                  <FakeNote title="DESCRIPTION DRAFT #5" lines={["light?? south?", "chef's kit?", "yard size?", "price TBD", "rewrite again"]} />
                  <FakePhotoStack />
                </div>
                <div className="col-span-3 space-y-3">
                  <FakeCard title="Listing Description" icon={ClipboardList} lines={["Sun-filled 3BR near Brookfield…", "EV-ready garage; new roof (2023)"]} />
                  <FakeCard title="Instagram Carousel" icon={Instagram} lines={["Slide 1: Just Listed", "Slide 2: 3 Bed • 2 Bath • 1,850 sq ft"]} />
                  <FakeCard title="30-sec Reel Script" icon={PlayCircle} lines={["Hook: If light matters…", "CTA: Comment 'TOUR'"]} />
                  <FakeCard title="Open House Email" icon={Mail} lines={["Subject: Open House Sat", "Reply to RSVP"]} />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/60">Illustrative UI – actual outputs below</div>
        </motion.div>
      </div>
    </section>
  );
}


