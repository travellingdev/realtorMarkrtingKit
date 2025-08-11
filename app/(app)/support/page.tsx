export default function SupportPage() {
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@example.com';
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Support</h1>
      <div className="mt-6 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5">
          <div className="text-sm text-white/60">Need help?</div>
          <p className="mt-2 text-white/80 text-sm">Email us at <a className="underline" href={`mailto:${email}`}>{email}</a> and we will get back within 1–2 business days.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5">
          <div className="text-sm text-white/60">FAQ</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-white/80 space-y-2">
            <li>How many free kits do I get? — Two (plus one with a 10s survey)</li>
            <li>Can I change plans later? — Yes, upgrade anytime</li>
            <li>Will it be MLS-safe? — We avoid fair housing red flags by default</li>
          </ul>
        </div>
      </div>
    </main>
  );
}


