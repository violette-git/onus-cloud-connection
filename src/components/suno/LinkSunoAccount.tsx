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
import { useToast } from "@/hooks/use-toast";

const SUNO_EXTENSION_URL = "https://chrome.google.com/webstore/detail/suno-extension/[extension-id]";

export const LinkSunoAccount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showExtensionPrompt, setShowExtensionPrompt] = useState(true);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [sunoDetails, setSunoDetails] = useState<{ username: string; email: string } | null>(null);
  const [newUserId, setNewUserId] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);

  useEffect(() => {
    const handleExtensionMessage = async (event: MessageEvent) => {
      if (event.data.type === 'SUNO_ACCOUNT_LINKED' && 
          event.data.sunoUsername && 
          event.data.sunoEmail) {
        
        setIsLinking(true);
        
        try {
          // Wait for the API response
          const response = await fetch('https://uticeouohtomjezepctd.functions.supabase.co/link-suno-account', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              username: event.data.sunoUsername,
              email: event.data.sunoEmail,
              code: event.data.code
            })
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to link account');
          }

          // Handle the successful linking response
          if (data.isNewUser && data.userId) {
            setNewUserId(data.userId);
            setShowPasswordDialog(true);
          } else {
            toast({
              title: "Success",
              description: "Your Suno account has been linked successfully!",
            });
            navigate('/profile');
          }
        } catch (error) {
          console.error('Error linking account:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to link account",
          });
        } finally {
          setIsLinking(false);
        }
      }
    };

    window.addEventListener('message', handleExtensionMessage);
    return () => window.removeEventListener('message', handleExtensionMessage);
  }, [navigate, toast]);

  const handlePasswordSubmit = async (values: { password: string }) => {
    if (!newUserId) return;

    try {
      const { error } = await supabase.auth.updateUser({ password: values.password });
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Your password has been set successfully!",
      });
      
      setShowPasswordDialog(false);
      navigate('/profile');
    } catch (error) {
      console.error('Error setting password:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to set password. Please try again.",
      });
    }
  };

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
        onSubmit={handlePasswordSubmit}
      />
    </Card>
  );
};