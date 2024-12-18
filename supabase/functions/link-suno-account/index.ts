import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

interface RequestBody {
  username: string;
  email: string;
  code: string;
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
    const { username, email, code }: RequestBody = await req.json()
    console.log('Received request with:', { username, email, code })

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

    console.log('Found valid linking code:', linkingCode)

    // Check if code has expired
    if (new Date(linkingCode.expires_at) < new Date()) {
      console.error('Linking code has expired')
      return new Response(
        JSON.stringify({ error: 'Linking code has expired' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update the linking code with Suno details
    const { error: updateError } = await supabaseClient
      .from('linking_codes')
      .update({ 
        suno_username: username,
        suno_email: email,
        used_at: new Date().toISOString()
      })
      .eq('code', code)

    if (updateError) {
      console.error('Error updating linking code:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update linking code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update the profile if a user_id exists
    if (linkingCode.user_id) {
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .update({
          suno_username: username,
          suno_email: email,
          linking_status: 'linked'
        })
        .eq('id', linkingCode.user_id)

      if (profileError) {
        console.error('Error updating profile:', profileError)
        return new Response(
          JSON.stringify({ error: 'Failed to update profile' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Successfully linked Suno account',
        userId: linkingCode.user_id 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})