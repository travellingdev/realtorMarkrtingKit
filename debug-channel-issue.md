# Channel Selection Bug Analysis

## The Issue
User reports that when they have exhausted their 2 free kits:
- UI correctly shows Instagram/Reel as locked
- But content is still generated for ALL channels
- Expected: Only MLS and Email should have content

## Root Cause Investigation

### 1. API Route (`app/api/generate/route.ts`)
The code at line 149-174 shows:
```typescript
const freeKitsRemaining = quotaUsed < (tierConfig.kitsPerMonth + extraQuota);

if (!freeKitsRemaining && !canUseFeature(userTier, 'allPlatforms')) {
  // Force channels to basic only
  tierAwareControls.channels = ['mls', 'email'];
}
```
**✅ This part is correct** - It forces channels to ['mls', 'email'] when free kits are exhausted.

### 2. Pipeline (`lib/ai/pipeline.ts`)
The filtering at line 843-873:
```typescript
if (controls.channels?.length) {
  // For each channel, if it's NOT in the selected list, clear it
  if (!controls.channels?.includes('mls')) o.mlsDesc = '';
  if (!controls.channels?.includes('instagram')) o.igSlides = [];
  // etc...
}
```
**✅ This logic is correct** - It clears content for unselected channels.

## Debugging Added

### API Route Debug Logs:
1. `[api/generate] DEBUG: Incoming request` - Shows what channels user selected
2. `[api/generate] DEBUG: Channel filtering logic` - Shows if filtering triggered
3. `[api/generate] FILTERING: User exhausted free kits` - Shows forced channel override
4. `[api/generate] DEBUG: Final channels being sent to pipeline` - What's actually sent

### Pipeline Debug Logs:
1. `[pipeline] DEBUG: generateKit called` - What channels were received
2. `[pipeline] DEBUG: Channel filtering START` - Before filtering
3. `[pipeline] MLS/Instagram/Reel/Email: keep=true/false` - Per-channel decisions
4. `[pipeline] Channel filtering COMPLETE` - After filtering results

## To Test:

1. **Check User State:**
   - Go to Supabase dashboard
   - Check profiles table for test user
   - Verify: quota_used = 2, quota_extra = 0
   - This means freeKitsRemaining = false

2. **Test Generation:**
   - Clear console
   - Go to /v3
   - Select all channels (even locked ones)
   - Generate content
   - Watch console logs

3. **Expected Logs:**
```
[api/generate] DEBUG: Incoming request
  incomingChannels: ['mls', 'instagram', 'reel', 'email']
  
[api/generate] FILTERING: User exhausted free kits
  originalChannels: ['mls', 'instagram', 'reel', 'email']
  forcedChannels: ['mls', 'email']
  
[api/generate] DEBUG: Final channels being sent to pipeline
  channelsToGenerate: ['mls', 'email']
  
[pipeline] DEBUG: generateKit called
  channelsReceived: ['mls', 'email']
  
[pipeline] MLS: keep=true
[pipeline] Instagram: keep=false
[pipeline] Reel: keep=false  
[pipeline] Email: keep=true
```

## Possible Issues:

1. **Cache Hit**: If factsHash matches a recent kit, it returns cached content (line 108-121)
   - This would bypass all filtering
   - Check for log: `[api/generate] cache hit`

2. **Controls Not Passed**: If controls aren't being passed correctly to pipeline
   - Check channelsReceived in pipeline logs

3. **Quota Calculation**: If quotaUsed or limit is wrong
   - Check the DEBUG logs for actual values

4. **Frontend Issue**: If v3 isn't passing channels correctly
   - Check network tab for what's sent in request body