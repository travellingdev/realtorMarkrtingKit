'use client';
import React, { useState } from "react";

export default function SurveyModal({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: () => void }) {
  const [answer, setAnswer] = useState('');
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60" onClick={onClose} />
    <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900/90 p-6">
      <div className="text-lg font-semibold">Quick 10‑second survey</div>
      <p className="mt-1 text-sm text-white/70">Unlock 1 more free kit when you answer one question.</p>
      <label className="mt-4 block text-sm text-white/80">How do you usually create listing copy?</label>
      <select value={answer} onChange={(e) => setAnswer(e.target.value)} className="mt-2 w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60">
        <option value="">Select an option</option>
        <option>Write it myself</option>
        <option>My team writes it</option>
        <option>Freelancer / agency</option>
        <option>Templates or previous listings</option>
      </select>
      <div className="mt-5 flex gap-3">
        <button onClick={onClose} className="w-1/3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10">Cancel</button>
        <button disabled={!answer} onClick={onSubmit} className={answer ? 'w-2/3 rounded-2xl px-4 py-2 font-semibold bg-white text-neutral-900 hover:opacity-90' : 'w-2/3 rounded-2xl px-4 py-2 font-semibold bg-white/20 text-white/60'}>Unlock 1 more free kit</button>
      </div>
    </div>
  </div>;
}
