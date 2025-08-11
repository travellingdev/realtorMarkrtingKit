'use client';
import { useState } from "react";
import { Check } from "lucide-react";

function PriceCard({ name, price, blurb, features, cta, highlight }: { name: string, price: string, blurb: string, features: string[], cta: string, highlight?: boolean }) {
  return (
    <div
      className={
        "relative rounded-3xl border p-6 bg-neutral-900/60 " +
        (highlight
          ? "border-cyan-400/60 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
          : "border-white/10")
      }
    >
      {highlight && (
        <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-1 text-xs font-semibold text-neutral-950">
          Most popular
        </span>
      )}
      <div className="text-sm text-white/70">{name}</div>
      <div className="mt-1 text-3xl font-semibold">{price}</div>
      <p className="mt-2 text-white/70">{blurb}</p>
      <ul className="mt-4 space-y-2 text-sm text-white/80">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <Check className="h-4 w-4 text-cyan-300" />
            {f}
          </li>
        ))}
      </ul>
      <button className="mt-6 w-full rounded-2xl bg-white px-4 py-2 font-semibold text-neutral-900 hover:opacity-90">
        {cta}
      </button>
    </div>
  );
}

export default function Pricing() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annually'>('monthly');

  return (
    <section id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Start free — 2 full kits on us</h2>
          <p className="mt-2 text-white/70">Then pick a plan that fits your workflow.</p>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="relative flex items-center rounded-full border border-white/10 bg-neutral-900/60 p-1">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                billingInterval === 'monthly' ? 'text-neutral-900' : 'text-white/70 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('annually')}
              className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                billingInterval === 'annually' ? 'text-neutral-900' : 'text-white/70 hover:text-white'
              }`}
            >
              Annually
              <span className="ml-2 rounded-full bg-cyan-400/20 px-2 py-0.5 text-xs text-cyan-300">2 months free</span>
            </button>
            <div
              className={`absolute top-1 bottom-1 bg-white transition-all duration-300 rounded-full ${
                billingInterval === 'monthly' ? 'left-1 w-[90px]' : 'left-[100px] w-[150px]'
              }`}
            />
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <PriceCard
            name="Starter"
            price="$0"
            blurb="Try a complete kit. No card."
            features={["2 full kits", "MLS + Social + Email", "Copy anywhere"]}
            cta="Get Started Free"
          />
          <PriceCard
            name="Pro"
            price={billingInterval === 'monthly' ? '$29/mo' : '$290/yr'}
            highlight
            blurb="For active solo agents."
            features={[
              "Unlimited kits",
              "Brand voice lock",
              "Photo-aware captions",
              "Priority support",
            ]}
            cta="Go Pro"
          />
          <PriceCard
            name="Team"
            price={billingInterval === 'monthly' ? '$99/mo' : '$990/yr'}
            blurb="For brokerages & teams."
            features={["Seats & roles", "Shared templates", "Approvals", "Analytics"]}
            cta="Contact Sales"
          />
        </div>
      </div>
    </section>
  );
}
