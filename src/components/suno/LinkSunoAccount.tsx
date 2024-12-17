import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ExtensionPrompt } from "./ExtensionPrompt";
import { LinkingCodeDisplay } from "./LinkingCodeDisplay";
import { PasswordDialog } from "./PasswordDialog";

const SUNO_EXTENSION_URL = "https://chrome.google.com/webstore/detail/suno-extension/[extension-id]";
const SUNO_ME_URL = "https://suno.com/me";

export const LinkSunoAccount = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [linkingCode, setLinkingCode] = useState("");
  const [showExtensionPrompt, setShowExtensionPrompt] = useState(true);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [sunoDetails, setSunoDetails] = useState<{ username: string; email: string } | null>(null);

  const generateLinkingCode = async () => {
    setLoading(true);
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      const { data, error } = await supabase
        .from('linking_codes')
        .insert({
          code: Math.random().toString(36).substring(2, 15),
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setLinkingCode(data.code);
      window.open(SUNO_ME_URL, '_blank');
    } catch (error) {
      console.error('Error generating linking code:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate linking code. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (values: { password: string; confirmPassword: string }) => {
    if (!sunoDetails) return;

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: sunoDetails.email,
        password: values.password,
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Success!",
        description: "Your account has been created and linked to Suno.",
      });

      setShowPasswordDialog(false);
      navigate('/profile');
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not create account. Please try again.",
      });
    }
  };

  // Handle messages from the Suno extension
  useState(() => {
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
  });

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

        <div className="space-y-4">
          <Button
            onClick={generateLinkingCode}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Linking Code'
            )}
          </Button>
          
          <LinkingCodeDisplay code={linkingCode} />
        </div>
      </CardContent>

      <PasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        onSubmit={onPasswordSubmit}
      />
    </Card>
  );
};