import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { LinkingCodeDisplay } from "./LinkingCodeDisplay";

interface LinkingProcessProps {
  onSunoDetails: (details: { username: string; email: string }) => void;
}

export const LinkingProcess = ({ onSunoDetails }: LinkingProcessProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [linkingCode, setLinkingCode] = useState("");

  const generateLinkingCode = async () => {
    setLoading(true);
    try {
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

      setLinkingCode(data.code);
      window.open('https://suno.com/me', '_blank');
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

  return (
    <div className="space-y-4">
      <Button
        onClick={generateLinkingCode}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate Linking Code'
        )}
      </Button>
      
      <LinkingCodeDisplay code={linkingCode} />
    </div>
  );
};