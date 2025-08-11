"use client";
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ClipboardList, Copy, Instagram, Mail, PlayCircle } from 'lucide-react';

function OutputCard({ title, icon: Icon, text, list, revealed, canCopy, onCopy, onRequestAuth }:{
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  text?: string;
  list?: string[];
  revealed: boolean;
  canCopy: boolean;
  onCopy: () => void;
  onRequestAuth: () => void;
}){
  const body = text ? (
    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">{text}</pre>
  ) : (
    <ul className="list-disc pl-5 space-y-2 text-sm text-white/90">
      {list?.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  );

  return (
    <div className="relative rounded-3xl border border-white/10 bg-neutral-900/60 p-5">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
          <Icon className="h-5 w-5 text-white/80" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <button
          onClick={canCopy ? onCopy : onRequestAuth}
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm transition ${
            canCopy ? 'border-white/10 bg-white text-neutral-900 hover:opacity-90' : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
          }`}
        >
          <Copy className="h-4 w-4" /> {canCopy ? 'Copy' : 'Sign in to Copy'}
        </button>
      </div>

      <div className="mt-4 relative">
        {!revealed && (
          <div className="absolute inset-0 z-10 rounded-2xl backdrop-blur-[2px] bg-neutral-950/40 flex items-center justify-center">
            <span className="text-white/70 text-sm">Click “Reveal results” to view</span>
          </div>
        )}
        {body}
      </div>
    </div>
  );
}

export default function OutputsSection({
  outputs,
  revealed,
  canCopyAll,
  onCopyAll,
  onRequestAuth,
  handleReveal,
  kitSample,
  isLoggedIn,
  generated,
}:{
  outputs: null | {
    mlsDesc: string;
    igSlides: string[];
    reelScript: string[];
    emailSubject: string;
    emailBody: string;
  };
  revealed: boolean;
  canCopyAll: boolean;
  onCopyAll: () => void;
  onRequestAuth: () => void;
  handleReveal: () => void;
  kitSample: boolean;
  isLoggedIn: boolean;
  generated: boolean;
}){
  return (
    <section id="outputs" className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Your marketing kit</h2>
            <p className="mt-2 text-white/70">MLS description, Instagram carousel, reel script, and email — generated from your details.</p>
          </div>
          {!revealed && generated ? (
            <button
              onClick={handleReveal}
              className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-neutral-950 shadow hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {kitSample
                ? 'Reveal results'
                : isLoggedIn
                ? 'Reveal results'
                : 'Sign in to reveal'}
            </button>
          ) : null}
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <OutputCard
            title="MLS Description"
            icon={ClipboardList}
            text={outputs?.mlsDesc}
            revealed={revealed}
            canCopy={kitSample ? isLoggedIn : revealed}
            onCopy={() => outputs && navigator.clipboard.writeText(outputs.mlsDesc)}
            onRequestAuth={onRequestAuth}
          />
          <OutputCard
            title="Instagram Carousel (caption)"
            icon={Instagram}
            list={outputs?.igSlides}
            revealed={revealed}
            canCopy={kitSample ? isLoggedIn : revealed}
            onCopy={() => outputs && navigator.clipboard.writeText(outputs.igSlides.join('\n'))}
            onRequestAuth={onRequestAuth}
          />
          <OutputCard
            title="30-Second Reel Script"
            icon={PlayCircle}
            list={outputs?.reelScript}
            revealed={revealed}
            canCopy={kitSample ? isLoggedIn : revealed}
            onCopy={() => outputs && navigator.clipboard.writeText(outputs.reelScript.join('\n'))}
            onRequestAuth={onRequestAuth}
          />
          <OutputCard
            title="Open House Email"
            icon={Mail}
            text={outputs ? `Subject: ${outputs.emailSubject}\n\n${outputs.emailBody}` : undefined}
            revealed={revealed}
            canCopy={kitSample ? isLoggedIn : revealed}
            onCopy={() => outputs && navigator.clipboard.writeText(`Subject: ${outputs.emailSubject}\n\n${outputs.emailBody}`)}
            onRequestAuth={onRequestAuth}
          />
        </div>

        <AnimatePresence>
          {canCopyAll && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
              <button onClick={onCopyAll} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-neutral-900 shadow-lg hover:opacity-90">
                <Copy className="h-4 w-4" /> Copy All Assets
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}


