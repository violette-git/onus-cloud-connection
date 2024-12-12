import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/integrations/supabase/client'
import { 
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export const AuthForm = () => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Welcome to Onus</DialogTitle>
        <DialogDescription>
          Sign in to your account or create a new one
        </DialogDescription>
      </DialogHeader>
      <Auth
        supabaseClient={supabase}
        appearance={{ 
          theme: ThemeSupa,
          style: {
            button: {
              background: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              borderRadius: 'var(--radius)',
            },
            anchor: {
              color: 'hsl(var(--primary))',
            },
          },
        }}
        theme="light"
        providers={[]}
        localization={{
          variables: {
            sign_in: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign in',
              loading_button_label: 'Signing in...',
              email_input_placeholder: 'Your email',
              password_input_placeholder: 'Your password',
              link_text: 'Already have an account? Sign in',
            },
            sign_up: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign up',
              loading_button_label: 'Signing up...',
              email_input_placeholder: 'Your email',
              password_input_placeholder: 'Your password',
              link_text: "Don't have an account? Sign up",
            },
          },
        }}
      />
    </>
  )
}