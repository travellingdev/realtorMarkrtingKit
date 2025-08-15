import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { supabaseServer, supabaseAdmin } from '@/lib/supabaseClients';
import { generateOutputs, PayloadSchema } from '@/lib/generator';
import { buildFacts, generateKit, PROMPT_VERSION } from '@/lib/ai/pipeline';
import { ControlsSchema } from '@/lib/ai/schemas';
import { getTierConfig, canUseFeature, isQuotaExceeded, canAnalyzePhotosWithTrial, getPhotoAnalysisMessage } from '@/lib/tiers';

export async function POST(req: Request) {
  const startedAt = Date.now();
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  
  // Allow anonymous users with session-based limits
  let userId: string;
  let userTier: string;
  let quotaUsed: number;
  let extraQuota: number;
  let isAnonymous = false;
  
  if (!user) {
    // Check if anonymous generation is allowed (handled by frontend)
    // Generate a temporary anonymous ID for this session
    const body = await req.json();
    const anonId = body.anonymousId;
    
    if (!anonId) {
      console.warn('[api/generate] unauthenticated request without anonymous ID');
      return NextResponse.json({ error: 'auth' }, { status: 401 });
    }
    
    console.log('[api/generate] anonymous request', { anonId });
    userId = anonId;
    userTier = 'ANONYMOUS';
    quotaUsed = 0;
    extraQuota = 0;
    isAnonymous = true;
    
    // Put the body back for later parsing
    req = new Request(req.url, {
      method: req.method,
      headers: req.headers,
      body: JSON.stringify(body)
    });
  } else {
    // Get user profile and tier information for authenticated users
    const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
    userId = user.id;
    userTier = profile?.plan || 'FREE';
    quotaUsed = profile?.quota_used || 0;
    extraQuota = profile?.quota_extra || 0;
  }
  
  const tierConfig = getTierConfig(userTier === 'ANONYMOUS' ? 'FREE' : userTier);
  
  console.log('[api/generate] begin', { 
    userId: userId, 
    tier: userTier,
    isAnonymous,
    quotaUsed, 
    limit: tierConfig.kitsPerMonth + extraQuota 
  });
  
  // Check quota limits (skip for anonymous users - handled by frontend)
  if (!isAnonymous && isQuotaExceeded(userTier, quotaUsed, extraQuota)) {
    console.warn('[api/generate] quota exceeded', { userId: userId, tier: userTier, used: quotaUsed });
    return NextResponse.json({ 
      error: 'quota_exceeded', 
      details: {
        tier: userTier,
        used: quotaUsed,
        limit: tierConfig.kitsPerMonth + extraQuota,
        upgradeRequired: true
      }
    }, { status: 429 });
  }
  const body = await req.json().catch(() => ({}));
  const payload = body.payload;
  const rawControls = body.controls ?? {};
  const payloadParse = PayloadSchema.safeParse(payload);
  if (!payloadParse.success) {
    console.warn('[api/generate] bad_request', { userId: userId, issues: payloadParse.error.issues?.slice?.(0, 3) });
    return NextResponse.json({ error: 'bad_request', details: payloadParse.error.flatten() }, { status: 400 });
  }
  const controlsParse = ControlsSchema.safeParse(rawControls);
  if (!controlsParse.success) {
    console.warn('[api/generate] bad_request', { userId: userId, issues: controlsParse.error.issues?.slice?.(0, 3) });
    return NextResponse.json({ error: 'bad_request', details: controlsParse.error.flatten() }, { status: 400 });
  }
  const payloadData = payloadParse.data;
  const controlsData = controlsParse.data;
  
  // Debug log incoming channels
  console.log('[api/generate] DEBUG: Incoming request', {
    userId: userId,
    tier: userTier,
    isAnonymous,
    quotaUsed,
    limit: tierConfig.kitsPerMonth + extraQuota,
    incomingChannels: controlsData.channels,
  });
  const facts = buildFacts(payloadData);
  const promptVersion = PROMPT_VERSION;
  const factsHash = createHash('sha256')
    .update(JSON.stringify({ facts, controls: controlsData, promptVersion }))
    .digest('hex');
  
  // For anonymous users, create a temporary kit object without database
  let kit: any;
  
  if (isAnonymous) {
    // Create a temporary kit for anonymous users
    kit = {
      id: `anon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      payload: payloadData,
      status: 'PROCESSING',
      facts_hash: factsHash,
      created_at: new Date().toISOString()
    };
    console.log('[api/generate] anonymous kit created', { 
      userId: userId, 
      kitId: kit.id
    });
  } else {
    // Regular database insert for authenticated users
    const { data: dbKit, error } = await sb
      .from('kits')
      .insert({
        user_id: userId,
        payload: payloadData,
        status: 'PROCESSING',
        facts_hash: factsHash,
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('[api/generate] insert kits failed', { userId: userId, error });
      return NextResponse.json({ error: 'db' }, { status: 500 });
    }
    
    kit = dbKit;
    console.log('[api/generate] kit row created', { 
      userId: userId, 
      kitId: kit.id,
      kitIdType: typeof kit.id,
      kitIdValue: kit.id
    });
  }

  async function updateKitReady(fields: any) {
    // Skip database update for anonymous users
    if (isAnonymous) {
      Object.assign(kit, fields, { status: 'READY' });
      return true;
    }
    
    // Remove fields that don't exist in the database schema
    const { photo_urls, ...safeFields } = fields;
    
    const { error: updErr } = await sb.from('kits').update({ status: 'READY', ...safeFields }).eq('id', kit.id);
    if (!updErr) return true;
    
    console.error('[api/generate] update via user client failed', { kitId: kit.id, updErr });
    
    // Try admin client only if service key is available
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const admin = supabaseAdmin();
        const { error: adminErr } = await admin.from('kits').update({ status: 'READY', ...safeFields }).eq('id', kit.id);
        if (adminErr) {
          console.error('[api/generate] update via admin client failed', { kitId: kit.id, adminErr });
          return false;
        }
        console.log('[api/generate] update via admin client success', { kitId: kit.id });
        return true;
      } catch (e: any) {
        console.error('[api/generate] admin update threw', { kitId: kit.id, error: String(e?.message || e) });
        return false;
      }
    } else {
      console.warn('[api/generate] Admin key not configured, cannot retry update');
      return false;
    }
  }

  const { data: cachedRows } = await sb
    .from('kits')
    .select('outputs, flags, latency_ms, token_counts, quality_score, id')
    .eq('facts_hash', factsHash)
    .eq('status', 'READY')
    .gt('created_at', new Date(Date.now() - 3600_000).toISOString())
    .order('created_at', { ascending: false })
    .limit(1);
  const cache = cachedRows?.[0];
  if (cache?.outputs) {
    await updateKitReady({
      outputs: cache.outputs,
      flags: cache.flags,
      latency_ms: cache.latency_ms,
      token_counts: cache.token_counts,
      quality_score: cache.quality_score,
      prompt_version: promptVersion,
    });
    console.log('[api/generate] cache hit', { userId: userId, kitId: kit.id, sourceKit: cache.id });
    console.log('[api/generate] done', { userId: userId, ms: Date.now() - startedAt });
    return NextResponse.json({ kitId: kit.id });
  }

  // Try AI with photo analysis first; fallback to local deterministic generator on failure
  try {
    // Apply tier-based feature gating
    const tierAwareFacts = { ...facts };
    const tierAwareControls = { ...controlsData };
    
    // Check if user can analyze photos (includes trial system for FREE tier)
    // Anonymous users get limited photo analysis
    const canAnalyzePhotos = isAnonymous ? true : canAnalyzePhotosWithTrial(userTier, quotaUsed);
    if (!canAnalyzePhotos) {
      tierAwareFacts.photos = [];
      console.log('[api/generate] Photo analysis not available', { 
        userId: userId, 
        tier: userTier, 
        quotaUsed,
        message: getPhotoAnalysisMessage(userTier, quotaUsed)
      });
    } else {
      console.log('[api/generate] Photo analysis enabled', { 
        userId: userId, 
        tier: userTier,
        isAnonymous,
        photoCount: tierAwareFacts.photos?.length || 0,
        message: isAnonymous ? 'Anonymous photo analysis (limited)' : getPhotoAnalysisMessage(userTier, quotaUsed)
      });
    }
    
    // Channel filtering based on tier
    if (!canUseFeature(userTier, 'allPlatforms')) {
      // FREE tier: Filter out premium channels if quota exceeded
      if (isQuotaExceeded(userTier, quotaUsed, extraQuota)) {
        // Only allow MLS and Email when quota exceeded
        const allowedChannels = ['mls', 'email'];
        tierAwareControls.channels = (tierAwareControls.channels || []).filter(ch => 
          allowedChannels.includes(ch)
        );
        console.log('[api/generate] Quota exceeded - limiting to basic channels', { 
          userId: userId, 
          tier: userTier,
          original: controlsData.channels,
          filtered: tierAwareControls.channels
        });
      }
    }
    
    console.log('[api/generate] Channel configuration', {
      userTier,
      quotaUsed,
      limit: tierConfig.kitsPerMonth + extraQuota,
      selectedChannels: tierAwareControls.channels,
      hasAllPlatforms: canUseFeature(userTier, 'allPlatforms'),
    });
    
    console.log('[api/generate] DEBUG: Final channels being sent to pipeline', {
      channelsToGenerate: tierAwareControls.channels,
    });
    
    const { outputs, flags, promptVersion, tokenCounts, photoInsights } = await generateKit({ 
      facts: tierAwareFacts, 
      controls: tierAwareControls,
      tierConfig 
    });
    const latencyMs = Date.now() - startedAt;
    const qualityScore = Math.max(0, 100 - flags.length * 10);
    
    // Store photo insights for potential hero image generation
    const kitData: any = {
      outputs,
      flags,
      latency_ms: latencyMs,
      token_counts: tokenCounts,
      quality_score: qualityScore,
      prompt_version: promptVersion,
    };
    
    if (photoInsights) {
      kitData.photo_insights = photoInsights;
      // Store photo URLs in photo_insights instead of separate field
      if (tierAwareFacts.photos && tierAwareFacts.photos.length > 0) {
        kitData.photo_insights.photos = tierAwareFacts.photos;
      }
      console.log('[api/generate] Photo analysis included', { 
        rooms: photoInsights.rooms.length,
        features: photoInsights.features.length,
        sellingPoints: photoInsights.sellingPoints.length,
        marketingAngles: photoInsights.marketingAngles.length,
        heroCandidate: photoInsights.heroCandidate?.index,
        keyFeatures: photoInsights.features.slice(0, 3)
      });
      
      // Log if photo analysis was successfully integrated into outputs
      const hasPhotoFeatures = outputs.mlsDesc.toLowerCase().includes(photoInsights.features[0]?.toLowerCase() || '') ||
                              outputs.igSlides.some(slide => photoInsights.features.some(f => slide.toLowerCase().includes(f.toLowerCase()))) ||
                              outputs.emailBody.toLowerCase().includes(photoInsights.features[0]?.toLowerCase() || '');
      
      console.log(`📝 [api/generate] Photo analysis integration check:`, {
        photoFeaturesFound: photoInsights.features.length,
        photoFeaturesInContent: hasPhotoFeatures,
        mlsLength: outputs.mlsDesc.length,
        igSlides: outputs.igSlides.length,
        sampleFeature: photoInsights.features[0] || 'none'
      });
    } else {
      console.log('📷 [api/generate] No photo analysis performed', { 
        tier: userTier, 
        quotaUsed, 
        photoCount: facts.photos?.length || 0 
      });
    }
    
    await updateKitReady(kitData);
    console.log('[api/generate] AI generation success', { userId: userId, kitId: kit.id, ms: latencyMs });
  } catch (e: any) {
    console.error('[api/generate] AI generation failed, falling back', { userId: userId, kitId: kit.id, error: String(e?.message || e) });
    const outputsLocal = generateOutputs(payloadData, controlsData);
    const latencyMs = Date.now() - startedAt;
    await updateKitReady({
      outputs: outputsLocal,
      flags: [],
      latency_ms: latencyMs,
      token_counts: { prompt: 0, completion: 0, total: 0 },
      quality_score: 100,
      prompt_version: null,
    });
    console.log('[api/generate] local generation success', { userId: userId, kitId: kit.id, ms: latencyMs });
  }

  console.log('[api/generate] done', { 
    userId: userId, 
    ms: Date.now() - startedAt,
    returningKitId: kit.id,
    kitIdType: typeof kit.id,
    isAnonymous
  });
  
  // For anonymous users, return outputs directly since they won't be able to fetch from DB
  if (isAnonymous) {
    return NextResponse.json({ 
      kitId: kit.id,
      status: 'READY',
      outputs: kit.outputs,
      photo_insights: kit.photo_insights
    });
  }
  
  return NextResponse.json({ kitId: kit.id });
}
