interface Env {
  // Bindings can be added here if needed
}

// In-memory anti-cheat verification ledger on Cloudflare Edge Worker
interface EdgeVoteRecord {
  projectId: string;
  userId: string;
  deviceFingerprint: string;
  ipHash: string;
  timestamp: number;
}

const edgeVotesCache: EdgeVoteRecord[] = [];

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const body = (await context.request.json()) as {
      projectId?: string;
      fingerprint?: string;
      userId?: string;
      userEmail?: string;
    };

    const { projectId, fingerprint, userId } = body;

    if (!projectId || !fingerprint) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Missing required parameters (projectId or fingerprint).',
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Capture Cloudflare client IP
    const clientIp = context.request.headers.get('cf-connecting-ip') || '127.0.0.1';

    // Edge SHA-256 IP hashing
    const msgBuffer = new TextEncoder().encode(clientIp + 'dpsi_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const ipHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    const effectiveUserId = userId || `guest_${fingerprint.substring(0, 12)}`;

    // Anti-Cheat Layer 3 Check: Hardware device canvas fingerprint collision
    const hasDeviceVoted = edgeVotesCache.some(
      (v) => v.projectId === projectId && v.deviceFingerprint === fingerprint
    );

    if (hasDeviceVoted) {
      return new Response(
        JSON.stringify({
          success: false,
          alreadyVoted: true,
          message: 'Anti-Cheat Alert: Hardware fingerprint collision detected. This device has already voted for this project.',
        }),
        { status: 409, headers: corsHeaders }
      );
    }

    // Anti-Cheat Layer 2 Check: User identity collision
    const hasUserVoted = edgeVotesCache.some(
      (v) => v.projectId === projectId && v.userId === effectiveUserId
    );

    if (hasUserVoted) {
      return new Response(
        JSON.stringify({
          success: false,
          alreadyVoted: true,
          message: 'Duplicate Vote: Your user identity has already voted for this project.',
        }),
        { status: 409, headers: corsHeaders }
      );
    }

    // Record verified vote
    edgeVotesCache.push({
      projectId,
      userId: effectiveUserId,
      deviceFingerprint: fingerprint,
      ipHash,
      timestamp: Date.now(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Verified vote recorded via multi-layer anti-cheat pipeline on Cloudflare Edge.',
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Edge error';
    return new Response(
      JSON.stringify({ success: false, message: errorMsg }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
