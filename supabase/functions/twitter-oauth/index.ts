import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { code } = await req.json();

    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Authorization code is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch(
      'https://api.twitter.com/2/oauth2/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${Deno.env.get('TWITTER_CLIENT_ID') || ''}:${Deno.env.get('TWITTER_CLIENT_SECRET') || ''}`)}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: Deno.env.get('TWITTER_CLIENT_ID') || '',
          code,
          redirect_uri: Deno.env.get('TWITTER_REDIRECT_URI') || '',
          code_verifier: 'challenge_code', // This should match what was generated during auth
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange authorization code for access token');
    }

    const tokenData = await tokenResponse.json();

    // Get user profile
    const profileResponse = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch Twitter profile');
    }

    const profileData = await profileResponse.json();
    const profile = profileData.data;

    return new Response(
      JSON.stringify({
        platform: 'twitter',
        profile: {
          id: profile.id,
          username: profile.username,
          followers_count: profile.public_metrics?.followers_count || 0,
        },
        access_token: tokenData.access_token,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Twitter OAuth error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
