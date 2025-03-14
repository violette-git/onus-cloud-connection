import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ExternalLink } from "lucide-react";
import { LinkingCodeDisplay } from "./LinkingCodeDisplay";

interface LinkingProcessProps {
  onSunoDetails: (details: { username: string; email: string }) => void;
  onLinkingCode: (code: string) => void;
  isLoading?: boolean;
}

export const LinkingProcess = ({ onSunoDetails, onLinkingCode, isLoading = false }: LinkingProcessProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [linkingCode, setLinkingCode] = useState("");

  const generateLinkingCode = async () => {
    setLoading(true);
    try {
      console.log("LinkingProcess: Generating new linking code");
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
      
      const code = data.code;
      console.log("LinkingProcess: Generated code:", code);
      setLinkingCode(code);
      onLinkingCode(code); // Pass the code back up to parent
    } catch (error) {
      console.error('LinkingProcess: Error generating linking code:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate linking code. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const openSunoProfile = () => {
    window.open('https://suno.ai/me', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={generateLinkingCode}
        disabled={loading || isLoading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Waiting for connection...
          </>
        ) : (
          'Generate Linking Code'
        )}
      </Button>
      
      {linkingCode && (
        <>
          <LinkingCodeDisplay code={linkingCode} />
          <Button 
            onClick={openSunoProfile}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Suno Profile
          </Button>
        </>
      )}
    </div>
  );
};
