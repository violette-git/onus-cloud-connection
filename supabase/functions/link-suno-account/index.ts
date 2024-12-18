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

    // Check if user exists with this email
    const { data: existingUser, error: userError } = await supabaseClient.auth
      .admin.listUsers()

    const userExists = existingUser?.users.some(user => user.email === email)

    let userId: string

    if (!userExists) {
      // Create a new user with a temporary password
      const tempPassword = Math.random().toString(36).substring(2, 15)
      const { data: newUser, error: createError } = await supabaseClient.auth.admin
        .createUser({
          email: email,
          password: tempPassword,
          email_confirm: true
        })

      if (createError) {
        console.error('Error creating new user:', createError)
        return new Response(
          JSON.stringify({ 
            error: 'Failed to create user account',
            details: createError.message 
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      userId = newUser.user.id
      console.log('Created new user:', userId)
    } else {
      console.error('User already exists with this email')
      return new Response(
        JSON.stringify({ error: 'User already exists with this email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update the linking code with the user ID
    const { error: updateLinkingError } = await supabaseClient
      .from('linking_codes')
      .update({ 
        user_id: userId,
        used_at: new Date().toISOString()
      })
      .eq('id', linkingCode.id)

    if (updateLinkingError) {
      console.error('Error updating linking code:', updateLinkingError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to update linking code',
          details: updateLinkingError.message 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update the profile with Suno details
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .update({
        suno_username: username,
        suno_email: email,
        linking_status: 'linked'
      })
      .eq('id', userId)

    if (profileError) {
      console.error('Error updating profile:', profileError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to update profile',
          details: profileError.message 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'Successfully linked Suno account',
        isNewUser: true,
        userId: userId
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error in link-suno-account function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})