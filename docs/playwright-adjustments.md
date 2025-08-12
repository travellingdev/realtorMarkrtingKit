## Playwright-related local changes to reapply if overwritten

This file tracks the small edits we made to get Playwright tests green and keep e2e behavior stable. If incoming changes overwrite them, reapply the snippets below.

### 1) `app/layout.tsx` — Title consistency

- Ensure the site title matches the test expectation.

```ts
// app/layout.tsx
export const metadata = { title: "Realtor's AI Marketing Kit", description: 'AI marketing kit for real estate' };
```

### 2) `app/page.tsx` — Import fixes + URL hash on scroll

- Ensure imports include React state hooks and constants used by tests/logic.

```ts
// app/page.tsx (imports)
import React, { useRef, useState } from 'react';
import { useRealtorKit } from '@/app/hooks/useRealtorKit';
import { PROPERTY_TEMPLATES, TONES, BASE_FREE_LIMIT } from '@/lib/constants';
```

- Make sure the CTA scroll also updates the URL to include `#demo` (needed for the test that expects the hash).

```ts
// app/page.tsx
const scrollToDemo = () => {
  const el = document.getElementById('demo');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    if (location.hash !== '#demo') {
      history.replaceState(null, '', '#demo');
    }
  }
};
```

- Import the base free limit constant to fix TS error in the `PaywallBanner` props and logic that compares `freeLimit` to `BASE_FREE_LIMIT`.

```ts
// app/page.tsx (imports)
import { PROPERTY_TEMPLATES, TONES, BASE_FREE_LIMIT } from '@/lib/constants';
```

If you use it in JSX, an example line looks like:

```tsx
<PaywallBanner
  show={showPaywall}
  extraUnlocked={freeLimit > BASE_FREE_LIMIT}
  onUnlockOneMore={unlockOneMore}
  onCheckout={startCheckout}
  busy={isCheckingOut}
/>
```

### 3) `tests/basic.spec.ts` — Disambiguate CTA button in strict mode

- There are two “Generate My First Kit →” buttons (header and hero). Use `.first()` to avoid strict mode violation and click the first match.

```ts
// tests/basic.spec.ts
await page.getByRole('button', { name: 'Generate My First Kit →' }).first().click();
await expect(page).toHaveURL(/#demo/);
```

### 4) How to run tests

```bash
npm ci                # first time only
npx playwright install
npx playwright test   # run all browsers
```

Optional helpers:

```bash
npx playwright test --headed
npx playwright test --project=chromium
npx playwright test --ui
npx playwright show-report
```

### Notes
- Sentry instrumentation warnings during dev server boot are expected and do not affect tests.
- Webpack “Critical dependency” warnings from `@supabase/realtime-js` are also non-blocking for tests.


