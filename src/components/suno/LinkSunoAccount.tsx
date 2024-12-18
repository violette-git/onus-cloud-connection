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
  const [linkingStatus, setLinkingStatus] = useState<'not_started' | 'pending' | 'completed'>('not_started');

  // Listen for messages from the Suno extension
  useEffect(() => {
    const handleExtensionMessage = (event: MessageEvent) => {
      console.log("Received message:", event.data);
      
      // Only handle messages with the correct type
      if (event.data.type === 'SUNO_ACCOUNT_LINKED') {
        console.log("Processing SUNO_ACCOUNT_LINKED message");
        
        if (event.data.sunoUsername && event.data.sunoEmail) {
          setSunoDetails({
            username: event.data.sunoUsername,
            email: event.data.sunoEmail
          });

          // If this is a new user, show the password dialog
          if (event.data.isNewUser && event.data.userId) {
            console.log("New user detected, showing password dialog");
            setNewUserId(event.data.userId);
            setShowPasswordDialog(true);
          } else {
            // Existing user, mark as completed and redirect
            console.log("Existing user, completing flow");
            setLinkingStatus('completed');
            toast({
              title: "Success",
              description: "Your Suno account has been linked successfully!",
            });
            setTimeout(() => {
              navigate('/profile');
            }, 2000);
          }
        }
      }
    };

    // Add the event listener
    window.addEventListener('message', handleExtensionMessage);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleExtensionMessage);
    };
  }, [navigate, toast]);

  const handlePasswordSubmit = async (values: { password: string; confirmPassword: string }) => {
    if (!newUserId) return;

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: values.password 
      });
      
      if (error) throw error;

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
      console.error('Error setting password:', error);
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
        {showExtensionPrompt && (
          <ExtensionPrompt
            onSkip={() => setShowExtensionPrompt(false)}
            extensionUrl={SUNO_EXTENSION_URL}
          />
        )}
        <LinkingProcess 
          onSunoDetails={setSunoDetails}
          onLinkingCode={code => {
            console.log("Generated linking code:", code);
            setLinkingStatus('pending');
          }}
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
