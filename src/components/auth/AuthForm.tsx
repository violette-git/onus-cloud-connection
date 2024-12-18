import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"

export const AuthForm = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/?signup=true');
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Welcome to Onus</DialogTitle>
        <DialogDescription>
          Sign in to your account or create a new one
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
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
          view="sign_in"
          showLinks={false}
        />
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Don't have an account?</p>
          <DialogClose asChild>
            <Button onClick={handleSignUp} variant="outline" className="w-full">
              Sign Up with Suno
            </Button>
          </DialogClose>
        </div>
      </div>
    </>
  )
}