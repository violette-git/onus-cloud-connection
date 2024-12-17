import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const LinkSunoAccount = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sunoUsername, setSunoUsername] = useState("");
  const [sunoEmail, setSunoEmail] = useState("");
  const [linkingCode, setLinkingCode] = useState("");

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
        description: "Use this code in the Suno app to link your account",
      });
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

  const handleLinkAccount = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('link-suno-account', {
        body: {
          code: linkingCode,
          sunoUsername,
          sunoEmail
        }
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your Suno account has been linked.",
      });

      // Clear form
      setSunoUsername("");
      setSunoEmail("");
      setLinkingCode("");
    } catch (error) {
      console.error('Error linking account:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not link Suno account. Please check your details and try again.",
      });
    } finally {
      setLoading(false);
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
      <CardContent className="space-y-4">
        <div className="space-y-2">
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
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="sunoUsername" className="text-sm font-medium">
              Suno Username
            </label>
            <Input
              id="sunoUsername"
              value={sunoUsername}
              onChange={(e) => setSunoUsername(e.target.value)}
              placeholder="Your Suno username"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="sunoEmail" className="text-sm font-medium">
              Suno Email
            </label>
            <Input
              id="sunoEmail"
              type="email"
              value={sunoEmail}
              onChange={(e) => setSunoEmail(e.target.value)}
              placeholder="Your Suno email address"
            />
          </div>

          <Button
            onClick={handleLinkAccount}
            disabled={loading || !sunoUsername || !sunoEmail}
            className="w-full"
          >
            Link Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};