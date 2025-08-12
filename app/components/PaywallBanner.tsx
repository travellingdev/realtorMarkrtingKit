"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard } from 'lucide-react';

export default function PaywallBanner({ show, extraUnlocked, onUnlockOneMore, onCheckout, busy }:{
  show: boolean;
  extraUnlocked: boolean;
  onUnlockOneMore: () => void;
  onCheckout: (plan: 'PRO' | 'TEAM') => void;
  busy?: boolean;
}){
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mt-4 rounded-3xl border border-cyan-400/40 bg-cyan-400/10 p-5"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">You&apos;ve used your free kits</div>
              <p className="text-white/70 text-sm mt-1">Upgrade for unlimited kits, brand lock, and saved templates.</p>
            </div>
            <div className="flex items-center gap-3">
              {!extraUnlocked && (
                <button onClick={onUnlockOneMore} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
                  Get 1 more free kit (10s survey)
                </button>
              )}
              <button disabled={busy} onClick={()=>onCheckout('PRO')} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed">
                <CreditCard className="h-4 w-4" /> Go Pro
              </button>
              <button disabled={busy} onClick={()=>onCheckout('TEAM')} className="inline-flex items-center gap-2 rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-neutral-900 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed">
                <CreditCard className="h-4 w-4" /> Team
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


