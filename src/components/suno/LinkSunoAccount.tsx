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
  const [newUserId, setNewUserId] = useState<string | null>(null);

  useEffect(() => {
    const handleExtensionMessage = (event: MessageEvent) => {
      console.log("LinkSunoAccount: Received message:", event.data);
      
      if (event.data.type === 'complete-suno-linking') {
        const { username, email, userId, isNewUser } = event.data;
        console.log("LinkSunoAccount: Received linking completion", { username, email, userId, isNewUser });
        
        setSunoDetails({ username, email });
        setLinkingStatus('pending');

        if (isNewUser) {
          console.log("LinkSunoAccount: New user detected, showing password dialog");
          setNewUserId(userId);
          setShowPasswordDialog(true);
        } else {
          console.log("LinkSunoAccount: Existing user, completing flow");
          setLinkingStatus('completed');
          toast({
            title: "Success",
            description: "Your Suno account has been linked successfully!",
          });
          // Add a delay before navigation to show the success message
          setTimeout(() => {
            navigate('/profile');
          }, 2000);
        }
      }
    };

    window.addEventListener('message', handleExtensionMessage);
    console.log("LinkSunoAccount: Added message listener");

    return () => {
      window.removeEventListener('message', handleExtensionMessage);
      console.log("LinkSunoAccount: Removed message listener");
    };
  }, [navigate, toast]);

  const handlePasswordSubmit = async (values: { password: string; confirmPassword: string }) => {
    if (!newUserId) {
      console.error("LinkSunoAccount: No userId available for password update");
      return;
    }

    try {
      console.log("LinkSunoAccount: Updating user password");
      
      // First sign in as the new user to get their session
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: sunoDetails?.email || '',
        password: values.password
      });

      if (signInError) throw signInError;

      setLinkingStatus('completed');
      toast({
        title: "Success",
        description: "Your password has been set successfully!",
      });
      
      setShowPasswordDialog(false);
      // Add a delay before navigation to show the success message
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
            onLinkingCode={code => {
              console.log("LinkSunoAccount: Generated linking code:", code);
              setLinkingStatus('pending');
            }}
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