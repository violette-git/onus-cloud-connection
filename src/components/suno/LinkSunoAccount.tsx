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
  const [linkingStatus, setLinkingStatus] = useState<'not_started' | 'pending' | 'completed'>('not_started');
  const [currentLinkingCode, setCurrentLinkingCode] = useState<string | null>(null);

  // Poll for linking code status
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkLinkingCode = async () => {
      if (!currentLinkingCode || linkingStatus !== 'pending') return;

      try {
        const { data: linkingCode, error } = await supabase
          .from('linking_codes')
          .select('used_at, suno_username, suno_email')
          .eq('code', currentLinkingCode)
          .maybeSingle();

        if (error) throw error;

        // If the code has been used and we have the required data
        if (linkingCode?.used_at && linkingCode?.suno_email) {
          console.log("LinkSunoAccount: Linking code used, showing password dialog");
          setSunoDetails({
            username: linkingCode.suno_username || '',
            email: linkingCode.suno_email
          });
          setShowPasswordDialog(true);
          // Clear the interval since we don't need to check anymore
          if (intervalId) clearInterval(intervalId);
        }
      } catch (error) {
        console.error('Error checking linking code status:', error);
      }
    };

    if (currentLinkingCode && linkingStatus === 'pending') {
      // Check immediately
      checkLinkingCode();
      // Then check every 5 seconds
      intervalId = setInterval(checkLinkingCode, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentLinkingCode, linkingStatus, showPasswordDialog]);

  const handlePasswordSubmit = async (values: { password: string; confirmPassword: string }) => {
    try {
      console.log("LinkSunoAccount: Setting up password for linked account");
      
      if (!sunoDetails?.email) {
        throw new Error("Email is missing from Suno account details");
      }

      // First, sign in with email (passwordless)
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: sunoDetails.email,
        options: {
          data: {
            suno_username: sunoDetails.username,
          }
        }
      });

      if (signInError) throw signInError;

      // Then update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.password
      });

      if (updateError) throw updateError;

      setLinkingStatus('completed');
      toast({
        title: "Success",
        description: "Your password has been set successfully!",
      });
      
      setShowPasswordDialog(false);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('LinkSunoAccount: Error setting password:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to set password. Please try again.",
      });
    }
  };

  const handleLinkingCode = async (code: string) => {
    console.log("LinkSunoAccount: Generated linking code:", code);
    setCurrentLinkingCode(code);
    setLinkingStatus('pending');
  };

  const renderContent = () => {
    if (linkingStatus === 'completed') {
      return (
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium">Account Linked Successfully!</h3>
          <p className="text-muted-foreground">
            Your Suno account has been linked. You will be redirected shortly...
          </p>
        </div>
      );
    }

    return (
      <>
        {showExtensionPrompt && (
          <ExtensionPrompt
            onSkip={() => setShowExtensionPrompt(false)}
            extensionUrl={SUNO_EXTENSION_URL}
          />
        )}
        <LinkingProcess 
          onSunoDetails={setSunoDetails}
          onLinkingCode={handleLinkingCode}
        />
      </>
    );
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
        {renderContent()}
      </CardContent>

      <PasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        onSubmit={handlePasswordSubmit}
      />
    </Card>
  );
};