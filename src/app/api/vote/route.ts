import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient';

// Server-side in-memory cache for anti-cheat verification during local demo / fallback mode
interface FallbackVoteRecord {
  projectId: string;
  userId: string;
  deviceFingerprint: string;
  ipHash: string;
  timestamp: number;
}

const fallbackVotesCache: FallbackVoteRecord[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, fingerprint, userId, userEmail } = body;

    if (!projectId || !fingerprint) {
      return NextResponse.json(
        { success: false, message: 'Missing required parameters (projectId or fingerprint).' },
        { status: 400 }
      );
    }

    // Extract client IP and hash for privacy-preserving rate limiting
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    const ipHash = crypto.createHash('sha256').update(clientIp + 'dpsi_salt_2026').digest('hex');

    // Effective user identifier (Google OAuth UID or authenticated guest ID)
    const effectiveUserId = userId || `guest_${fingerprint.substring(0, 12)}`;

    // -------------------------------------------------------------
    // LIVE SUPABASE POSTGRESQL VERIFICATION
    // -------------------------------------------------------------
    if (isSupabaseConfigured && supabase) {
      // Layer 3 Check: Query existing vote by device fingerprint for this project
      const { data: existingDeviceVote } = await supabase
        .from('votes')
        .select('id, user_id')
        .eq('project_id', projectId)
        .eq('device_fingerprint', fingerprint)
        .limit(1)
        .maybeSingle();

      if (existingDeviceVote) {
        return NextResponse.json(
          {
            success: false,
            alreadyVoted: true,
            message: 'Anti-Cheat Alert: This device hardware has already cast a vote for this project.',
          },
          { status: 409 }
        );
      }

      // Layer 2 Check: Query existing vote by user ID for this project
      const { data: existingUserVote } = await supabase
        .from('votes')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', effectiveUserId)
        .limit(1)
        .maybeSingle();

      if (existingUserVote) {
        return NextResponse.json(
          {
            success: false,
            alreadyVoted: true,
            message: 'Duplicate Vote: Your account has already voted for this project.',
          },
          { status: 409 }
        );
      }

      // Insert vote row (Triggers automatic atomic vote_count increment in projects table)
      const { error: insertError } = await supabase.from('votes').insert([
        {
          project_id: projectId,
          user_id: effectiveUserId,
          device_fingerprint: fingerprint,
          ip_hash: ipHash,
        },
      ]);

      if (insertError) {
        // Postgres Unique constraint violation code
        if (insertError.code === '23505') {
          return NextResponse.json(
            {
              success: false,
              alreadyVoted: true,
              message: 'Duplicate Vote prevented by database unique constraints.',
            },
            { status: 409 }
          );
        }

        console.error('Supabase vote error:', insertError);
        return NextResponse.json(
          { success: false, message: 'Database transaction error while recording vote.' },
          { status: 500 }
        );
      }

      // Fetch the updated vote count to sync with client
      const { data: updatedProject } = await supabase
        .from('projects')
        .select('vote_count')
        .eq('id', projectId)
        .single();

      return NextResponse.json({
        success: true,
        message: 'Verified vote recorded successfully via Supabase RLS.',
        newVoteCount: updatedProject?.vote_count,
      });
    }

    // -------------------------------------------------------------
    // FALLBACK VERIFIED IN-MEMORY & FINGERPRINT VALIDATION
    // (Used when Supabase environment keys are not yet configured)
    // -------------------------------------------------------------
    const hasDeviceVoted = fallbackVotesCache.some(
      (v) => v.projectId === projectId && v.deviceFingerprint === fingerprint
    );

    if (hasDeviceVoted) {
      return NextResponse.json(
        {
          success: false,
          alreadyVoted: true,
          message: 'Anti-Cheat Alert: Hardware fingerprint collision detected. This device has already voted for this project.',
        },
        { status: 409 }
      );
    }

    const hasUserVoted = fallbackVotesCache.some(
      (v) => v.projectId === projectId && v.userId === effectiveUserId
    );

    if (hasUserVoted) {
      return NextResponse.json(
        {
          success: false,
          alreadyVoted: true,
          message: 'Duplicate Vote: Your user identity has already voted for this project.',
        },
        { status: 409 }
      );
    }

    // Record verified vote in fallback ledger
    fallbackVotesCache.push({
      projectId,
      userId: effectiveUserId,
      deviceFingerprint: fingerprint,
      ipHash,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: 'Verified vote recorded via multi-layer anti-cheat pipeline.',
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    console.error('Vote API error:', err);
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
