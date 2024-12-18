import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

interface RequestBody {
  username: string;
  email: string;
  userId: string;
  isNewUser: boolean;
}

Deno.serve(async (req) => {
  // Log the incoming request
  console.log('complete-suno-linking: Received request:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const requestBody = await req.json() as RequestBody;
    console.log('complete-suno-linking: Request body:', requestBody);

    const { username, email, userId, isNewUser } = requestBody;
    console.log('complete-suno-linking: Processing request for:', { username, email, userId, isNewUser });

    if (!username || !email || !userId) {
      console.error('complete-suno-linking: Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('complete-suno-linking: Updating profile for user:', userId);

    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({
        linking_status: 'completed',
        suno_username: username,
        suno_email: email
      })
      .eq('id', userId)

    if (updateError) {
      console.error('complete-suno-linking: Error updating profile:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('complete-suno-linking: Successfully updated profile, sending response');

    return new Response(
      JSON.stringify({
        success: true,
        type: 'SUNO_ACCOUNT_LINKED',
        sunoUsername: username,
        sunoEmail: email,
        isNewUser,
        userId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('complete-suno-linking: Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})