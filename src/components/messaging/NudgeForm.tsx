import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface NudgeFormProps {
  recipientId: string;
  onSuccess?: () => void;
}

export const NudgeForm = ({ recipientId, onSuccess }: NudgeFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !message.trim()) return;

    setIsSending(true);
    const { error } = await supabase.from("nudges").insert({
      sender_id: user.id,
      recipient_id: recipientId,
      message: message.trim(),
    });

    setIsSending(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: error.message,
      });
      return;
    }

    setMessage("");
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully.",
    });
    onSuccess?.();
  };

  const characterCount = message.length;
  const maxLength = 150;

  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={maxLength}
              className="min-h-[100px] resize-none pr-16"
              disabled={isSending}
            />
            <span className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              {characterCount}/{maxLength}
            </span>
          </div>
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSending || !message.trim()}
              className="transition-all duration-200 ease-in-out"
            >
              {isSending ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                  Sending...
                </span>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};