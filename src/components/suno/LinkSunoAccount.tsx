import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download } from "lucide-react";

const SUNO_EXTENSION_URL = "https://chrome.google.com/webstore/detail/suno-extension/[extension-id]";
const SUNO_ME_URL = "https://suno.com/me";

export const LinkSunoAccount = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [linkingCode, setLinkingCode] = useState("");
  const [showExtensionPrompt, setShowExtensionPrompt] = useState(true);

  const generateLinkingCode = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Create a linking code that expires in 1 hour
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      const { data, error } = await supabase
        .from('linking_codes')
        .insert({
          user_id: user.id,
          code: Math.random().toString(36).substring(2, 15),
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setLinkingCode(data.code);
      toast({
        title: "Linking code generated",
        description: "Use this code in the Suno extension to link your account",
      });
      
      // Open Suno profile page in a new tab
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

  useEffect(() => {
    const handleExtensionMessage = async (event: MessageEvent) => {
      if (event.data.type === 'SUNO_ACCOUNT_LINKED' && event.data.sunoUsername && event.data.sunoEmail) {
        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              suno_username: event.data.sunoUsername,
              suno_email: event.data.sunoEmail
            })
            .eq('id', user?.id);

          if (error) throw error;

          toast({
            title: "Success!",
            description: "Your Suno account has been linked.",
          });

          // Redirect to private profile
          navigate('/profile');
        } catch (error) {
          console.error('Error updating profile:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not update profile with Suno details. Please try again.",
          });
        }
      }
    };

    window.addEventListener('message', handleExtensionMessage);
    return () => window.removeEventListener('message', handleExtensionMessage);
  }, [user?.id, navigate, toast]);

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
          <Alert>
            <AlertDescription className="space-y-4">
              <p>To link your Suno account, you'll need to:</p>
              <ol className="list-decimal pl-4 space-y-2">
                <li>Install the Suno Chrome extension</li>
                <li>Generate a linking code</li>
                <li>Use the code in the extension on your Suno profile page</li>
              </ol>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open(SUNO_EXTENSION_URL, '_blank')}
              >
                <Download className="mr-2 h-4 w-4" />
                Install Suno Extension
              </Button>
              <Button 
                variant="link" 
                className="w-full"
                onClick={() => setShowExtensionPrompt(false)}
              >
                I already have the extension
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <Button
            onClick={generateLinkingCode}
            disabled={loading}
            className="w-full"
          >
            Generate Linking Code
          </Button>
          
          {linkingCode && (
            <div className="p-4 bg-muted rounded-md text-center">
              <p className="text-sm text-muted-foreground">Your linking code:</p>
              <p className="text-xl font-mono">{linkingCode}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Use this code in the Suno extension on your profile page
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
