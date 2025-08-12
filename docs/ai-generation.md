## AI generation controls and telemetry

Environment variables:

- `OPENAI_API_KEY`: required server-side key.
- `OPENAI_MODEL_FREE`: default `gpt-5-2025-08-07` (set to `gpt-5-mini` for speed/cost)
- `OPENAI_MODEL_PRO`: default `gpt-5-2025-08-07` (set to `gpt-5`)
- `OPENAI_TIMEOUT_MS`: default `15000` (bump to `20000` if network is slow)
- `OPENAI_PROMPT_VERSION`: default `v2` (bump when prompts change)
- `OPENAI_CRITIQUE_PASS`: default `true` (set `false` to disable critique step)

Server route `app/api/generate/route.ts` stores:

- `flags`: string[] (e.g., `['ai','model:gpt-5']`, or `['fallback','reason:timeout']`)
- `latency_ms`: generation duration
- `prompt_version`: from `OPENAI_PROMPT_VERSION`
- `token_counts`: `{ prompt, completion, total }` from provider when available
- `facts_hash`: fingerprint of inputs, used to short-circuit duplicate generations
- `quality_score`: placeholder metric (reduce as flags grow)

Quick test (PowerShell):

```powershell
$env:OPENAI_API_KEY="sk-..."
$env:OPENAI_MODEL_FREE="gpt-5-mini"
$env:OPENAI_TIMEOUT_MS="20000"
npm run build; npm start
```

Expect server logs:

- AI success → kit READY, flags include `ai`
- Timeout/provider error → fallback and kit READY with `fallback` flags


