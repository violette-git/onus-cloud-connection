import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

interface RequestBody {
  code: string;
  sunoUsername: string;
  sunoEmail: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request body
    const { code, sunoUsername, sunoEmail }: RequestBody = await req.json()

    // Validate the linking code
    const { data: linkingCode, error: linkingCodeError } = await supabaseClient
      .from('linking_codes')
      .select('*')
      .eq('code', code)
      .is('used_at', null)
      .single()

    if (linkingCodeError || !linkingCode) {
      console.error('Invalid or expired linking code:', linkingCodeError)
      return new Response(
        JSON.stringify({ error: 'Invalid or expired linking code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if code has expired
    if (new Date(linkingCode.expires_at) < new Date()) {
      console.error('Linking code has expired')
      return new Response(
        JSON.stringify({ error: 'Linking code has expired' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update the profile with Suno details
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({
        suno_username: sunoUsername,
        suno_email: sunoEmail
      })
      .eq('id', linkingCode.user_id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Mark the linking code as used
    const { error: usedCodeError } = await supabaseClient
      .from('linking_codes')
      .update({ used_at: new Date().toISOString() })
      .eq('id', linkingCode.id)

    if (usedCodeError) {
      console.error('Error marking code as used:', usedCodeError)
      // Don't return error here as the profile was already updated
    }

    return new Response(
      JSON.stringify({ message: 'Successfully linked Suno account' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in link-suno-account function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})