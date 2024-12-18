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

  useEffect(() => {
    const handleExtensionMessage = (event: MessageEvent) => {
      console.log("LinkSunoAccount: Received message event:", event);
      console.log("LinkSunoAccount: Message data:", event.data);
      
      // Extract data from the message
      const { username, email, isNewUser, userId } = event.data;
      
      if (username && email) {
        console.log("LinkSunoAccount: Setting Suno details", { username, email });
        setSunoDetails({
          username: username,
          email: email
        });

        if (isNewUser && userId) {
          console.log("LinkSunoAccount: New user detected, showing password dialog", { userId });
          setNewUserId(userId);
          setShowPasswordDialog(true);
        } else {
          console.log("LinkSunoAccount: Existing user, completing flow");
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
    };

    // Set up message channel
    console.log("LinkSunoAccount: Setting up message channel");
    window.addEventListener('message', handleExtensionMessage);

    // Notify extension that we're ready to receive messages
    const targetOrigins = [
      'https://preview--onus-cloud-connection.lovable.app',
      'http://localhost:3000',
      'https://lovable.dev',
      'https://gptengineer.app'
    ];

    targetOrigins.forEach(origin => {
      try {
        window.parent.postMessage({ type: 'SUNO_LINK_READY' }, origin);
        console.log(`LinkSunoAccount: Sent ready message to ${origin}`);
      } catch (error) {
        console.log(`LinkSunoAccount: Failed to send ready message to ${origin}`, error);
      }
    });

    return () => {
      console.log("LinkSunoAccount: Cleaning up message listener");
      window.removeEventListener('message', handleExtensionMessage);
    };
  }, [navigate, toast]);

  const handlePasswordSubmit = async (values: { password: string; confirmPassword: string }) => {
    if (!newUserId) {
      console.error("LinkSunoAccount: No userId available for password update");
      return;
    }

    try {
      console.log("LinkSunoAccount: Updating user password");
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
        {showExtensionPrompt && (
          <ExtensionPrompt
            onSkip={() => setShowExtensionPrompt(false)}
            extensionUrl={SUNO_EXTENSION_URL}
          />
        )}
        <LinkingProcess 
          onSunoDetails={setSunoDetails}
          onLinkingCode={code => {
            console.log("LinkSunoAccount: Generated linking code:", code);
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