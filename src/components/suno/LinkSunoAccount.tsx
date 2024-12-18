import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExtensionPrompt } from "./ExtensionPrompt";
import { LinkingProcess } from "./LinkingProcess";
import { PasswordDialog } from "./PasswordDialog";
import { supabase } from "@/integrations/supabase/client";

const SUNO_EXTENSION_URL = "https://chrome.google.com/webstore/detail/suno-extension/[extension-id]";

export const LinkSunoAccount = () => {
  const navigate = useNavigate();
  const [showExtensionPrompt, setShowExtensionPrompt] = useState(true);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [sunoDetails, setSunoDetails] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    const handleExtensionMessage = (event: MessageEvent) => {
      if (event.data.type === 'SUNO_ACCOUNT_LINKED' && event.data.sunoUsername && event.data.sunoEmail) {
        setSunoDetails({
          username: event.data.sunoUsername,
          email: event.data.sunoEmail
        });
        setShowPasswordDialog(true);
      }
    };

    window.addEventListener('message', handleExtensionMessage);
    return () => window.removeEventListener('message', handleExtensionMessage);
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Link Suno Account</CardTitle>
        <CardDescription>
          Connect your Suno account to enable AI music generation features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {showExtensionPrompt && (
          <ExtensionPrompt
            onSkip={() => setShowExtensionPrompt(false)}
            extensionUrl={SUNO_EXTENSION_URL}
          />
        )}

        <LinkingProcess onSunoDetails={setSunoDetails} />
      </CardContent>

      <PasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        onSubmit={async (values) => {
          if (!sunoDetails) return;
          try {
            const { error: signUpError } = await supabase.auth.signUp({
              email: sunoDetails.email,
              password: values.password,
            });

            if (signUpError) throw signUpError;
            setShowPasswordDialog(false);
            navigate('/profile');
          } catch (error) {
            console.error('Error creating account:', error);
          }
        }}
      />
    </Card>
  );
};