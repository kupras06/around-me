import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createHmac } from 'https://deno.land/std@0.177.0/node/crypto.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req: Request) => {
  const signature = req.headers.get('x-twitter-webhooks-signature');
  const body = await req.text();

  if (
    !verifyTwitterSignature(
      body,
      signature,
      Deno.env.get('TWITTER_CONSUMER_SECRET')!
    )
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  const payload = JSON.parse(body);
  const tweet = payload.tweet_create_events?.[0];

  if (!tweet) return new Response('OK', { status: 200 });

  // Map tweet user to creator
  const { data: creator } = await supabase
    .from('creators')
    .select('id')
    .eq('twitter_id', tweet.user.id_str)
    .single();

  if (creator) {
    // Note: place_id is null here. It might need resolution via
    // a separate process or NLP on the tweet text.
    await supabase.from('submissions').insert({
      creator_id: creator.id,
      post_url: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
      status: 'pending',
      place_id: null,
    });
  }

  return new Response('OK', { status: 200 });
});

function verifyTwitterSignature(
  body: string,
  signature: string | null,
  secret: string
) {
  if (!signature) return false;
  const hmac = createHmac('sha256', secret);
  hmac.update(body);
  const calculatedSignature = `sha256=${hmac.digest('base64')}`;
  return calculatedSignature === signature;
}
