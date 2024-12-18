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

  // Listen for extension messages for backward compatibility
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
    setLinkingStatus('pending');
    
    // Show password dialog immediately after generating code
    setShowPasswordDialog(true);
    // For testing, set some dummy suno details
    setSunoDetails({
      username: "testuser",
      email: "testuser@suno.ai"
    });
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