'use client';
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
  return (
    <section id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Start free — 2 full kits on us</h2>
          <p className="mt-2 text-white/70">Then pick a plan that fits your workflow.</p>
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
            price="$29/mo"
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
            price="$99/mo"
            blurb="For brokerages & teams."
            features={["Seats & roles", "Shared templates", "Approvals", "Analytics"]}
            cta="Contact Sales"
          />
        </div>
      </div>
    </section>
  );
}
