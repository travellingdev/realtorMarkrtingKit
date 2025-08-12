## Realtor AI generation – end-to-end flow and controls

This document explains exactly what inputs exist, how they map to the AI payload/controls, defaults when omitted, and UI behavior during generation and reveal.

### 1) User inputs (Instant Demo form)

- Address (string, optional)
- Neighborhood (string, optional)
- Beds (string/number, optional)
- Baths (string/number, optional)
- Square Feet (string/number, optional)
- Key features (comma-separated string → array of strings; up to 10 used)
- Property template (one of constants; default: "Starter Home")
- Tone (one of constants; default: "Warm & Lifestyle")
- Channels (checkboxes: mls, instagram, reel, email; default: all four)
- Brand voice (free text; optional)
- Open house date/time/link (optional)
- CTA: type (none/phone/link/custom) + phone/link/custom text (optional)
- Social handle / hashtag strategy / extra hashtags (optional)
- Reading level (optional), Use emojis (boolean, default false)
- MLS format (paragraph/bullets; default paragraph)
- Must include / Avoid words (comma-separated lists; optional)

UI source: `app/components/InstantDemoForm.tsx` and `app/page.tsx` via `useRealtorKit` hook.

### 2) How inputs map to the AI request

- Builder: `lib/payloadBuilder.ts`
  - Produces two objects:
    - `payload` (sent to model as FACTS):
      - `address`, `neighborhood`, `beds`, `baths`, `sqft` (strings, trimmed; undefined if empty)
      - `features`: parsed from comma list; undefined if empty
      - `tone`, `propertyType`, `brandVoice` (trimmed; undefined if empty)
    - `controls` (server-side controls/policy):
      - `channels` (subset of mls/instagram/reel/email) if any are selected
      - `openHouseDate|Time|Link` (trimmed)
      - `ctaType|Phone|Link|Custom` (trimmed)
      - `socialHandle|hashtagStrategy|extraHashtags` (trimmed)
      - `readingLevel` (trimmed), `useEmojis` (boolean)
      - `mlsFormat` (paragraph/bullets)
      - `policy`: `{ mustInclude: string[], avoidWords: string[] }` from comma-separated fields

Defaults when omitted:
- Empty strings become `undefined` in `payload`/`controls`.
- `features` becomes `undefined` if none parsed.
- `channels` omitted if none selected (server treats missing as no restriction).
- `useEmojis` omitted unless true.
- `mlsFormat` carries selected value (defaults to `paragraph`).

### 3) Server flow

- Route: `app/api/generate/route.ts`
  - Auth required; otherwise 401.
  - Accepts either legacy body (raw payload) or `{ payload, controls }` envelope.
  - Computes `facts_hash` from facts + controls + promptVersion.
  - Inserts kit with `status=PROCESSING`.
  - Cache check: recent READY kit with same `facts_hash` (last 60 minutes) → copy outputs/telemetry.
  - AI path: calls pipeline `generateKit({ facts, controls })`.
    - On success: updates kit with `outputs`, `latency_ms`, `flags=['ai','plan:FREE|PRO|TEAM', ...complianceFlags]`, `token_counts`, `quality_score`, `prompt_version`.
    - On failure/timeout: local fallback `generateOutputs()` → updates kit with `flags=['fallback','reason:timeout|provider']` and telemetry.
  - Uses admin client for update if RLS blocks.

- Pipeline: `lib/ai/pipeline.ts`
  - `buildFacts(payload)`: trims/limits features; validates shape.
  - Messages: draft and critique messages built from facts and policy.
  - Provider: `lib/ai/provider.ts` (OpenAI chat completions, json_schema)
    - Times out via AbortController (currently 15s; reads 15s unless wired to env).
    - Retries once; logs usage tokens, 429/5xx errors.
  - Post-process: clamp lengths (MLS ≤ 900, IG lines ≤ 110, reel 3 lines, subject ≤ 70, body ≤ 900).
  - Compliance scan: flags simple banned words; optional re-critique passes to fix policy violations.

- OpenAI alternative path: `lib/ai/openai.ts` (json_object, critique+retry, zod validation)
  - Not used by the current pipeline route, but available.
  - Respects `OPENAI_TIMEOUT_MS`, `OPENAI_MODEL_*`, `OPENAI_CRITIQUE_PASS`, `OPENAI_PROMPT_VERSION`.

### 4) UI behavior during generation

- Generate button (`InstantDemoForm`):
  - Disables and shows "Generating…" while `isGenerating` is true (hook sets it before request and resets finally).
  - Scrolls to outputs section.

- Outputs section: `app/components/OutputsSection.tsx`
  - While `kitStatus === 'PROCESSING'`: shows skeleton loaders.
  - After `READY`: renders outputs; if not revealed, overlay says "Click Reveal results to view".
  - "Reveal results" button is shown when outputs exist and not revealed.
  - Copy buttons say "Sign in to Copy" until authenticated or revealed logic allows.
  - "Copy All" floating button appears when `canCopyAll()` is true.

- Reveal:
  - `useRealtorKit.handleReveal()` calls `/api/reveal` to enforce quota.
    - 401 → triggers auth modal.
    - 402 → shows paywall (currently only toast via `copyToast`; banner managed in page state).
    - 200 → increments quota, sets `revealed=true`.

### 5) Defaults and their effects

- If user omits address/neighborhood/beds/baths/sqft:
  - Model instructed not to invent facts. Fallback text uses placeholders like `?` where needed.

- Channels empty: omitted from controls; current prompts do not filter channels downstream (content includes all four outputs by default). Future work: tailor per-channel generation when needed.

- CTA, social, hashtags, reading level, emojis, MLS format:
  - Included in `controls`, used in prompts/policy in pipeline critique passes; not all are strictly enforced in draft path; policy controls steer wording in critique.

### 6) Known issues and flags

- AI timeouts: provider path uses 15s timeout; if network slow, requests abort and fallback triggers. Mitigation: set `OPENAI_TIMEOUT_MS` in provider, or use lighter model.

- Copy gating:
  - Copy buttons depend on `revealed` and `kitSample`/auth status. If user signs in after generation, `useUser` revalidates `/api/me`, and copy buttons switch accordingly. If you see "Sign in to Copy" while logged in, ensure `useUser` revalidated and `revealed` state is set.

- Content visible during PROCESSING:
  - UI shows skeletons while PROCESSING; overlay hides content until `revealed`. If you see content during PROCESSING, check `kitStatus` transitions.

- Channels not shaping outputs yet:
  - Present in `controls`, but current prompts do not prune outputs by channel. Marked as enhancement.

### 7) Quick traces – where to look

- Server logs (Next.js):
  - `[openai] env …` (masked key, model, timeout)
  - `[api/generate] invoking pipeline …`
  - `[pipeline] draft/critique …` and `[provider] request/success/error`
  - AI success vs fallback with flags and token counts

- Client console:
  - `[useRealtorKit] onGenerate begin` / payload summary
  - `/api/generate ok { kitId }` then `kit ready { ms }`
  - Reveal logs and quota responses

### 8) Acceptance checklist

- All form fields map to either `payload` or `controls` (see builder) with sane defaults.
- While generating: button disables, skeletons show, no outputs until READY.
- After READY: overlay blocks until reveal; reveal increments quota; copy depends on auth/reveal.
- AI path logs tokens/flags; fallback flags include reason; telemetry is stored on `kits`.


