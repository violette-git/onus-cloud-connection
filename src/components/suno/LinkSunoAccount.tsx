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
        const { data, error } = await supabase
          .from('linking_codes')
          .select('used_at, user_id')
          .eq('code', currentLinkingCode)
          .single();

        if (error) throw error;

        // If the code has been used, trigger password creation
        if (data.used_at && !showPasswordDialog) {
          console.log("LinkSunoAccount: Linking code used, showing password dialog");
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

  // Legacy extension message handler
  useEffect(() => {
    const handleExtensionMessage = (event: MessageEvent) => {
      if (event.data.type === 'complete-suno-linking') {
        const { username, email } = event.data;
        console.log("LinkSunoAccount: Received linking completion", { username, email });
        
        setSunoDetails({ username, email });
        setLinkingStatus('completed');
        toast({
          title: "Success",
          description: "Your Suno account has been linked successfully!",
        });
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      }
    };

    window.addEventListener('message', handleExtensionMessage);
    return () => window.removeEventListener('message', handleExtensionMessage);
  }, [navigate, toast]);

  const handlePasswordSubmit = async (values: { password: string; confirmPassword: string }) => {
    try {
      console.log("LinkSunoAccount: Setting up new account");
      
      // Create a new user with the generated email and password
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: sunoDetails?.email || '',
        password: values.password,
        options: {
          data: {
            suno_username: sunoDetails?.username,
          }
        }
      });

      if (signUpError) throw signUpError;

      setLinkingStatus('completed');
      toast({
        title: "Success",
        description: "Your account has been created successfully!",
      });
      
      setShowPasswordDialog(false);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('LinkSunoAccount: Error creating account:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create account. Please try again.",
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
        {showExtensionPrompt && !showPasswordDialog && (
          <ExtensionPrompt
            onSkip={() => setShowExtensionPrompt(false)}
            extensionUrl={SUNO_EXTENSION_URL}
          />
        )}
        {!showPasswordDialog && (
          <LinkingProcess 
            onSunoDetails={setSunoDetails}
            onLinkingCode={handleLinkingCode}
          />
        )}
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