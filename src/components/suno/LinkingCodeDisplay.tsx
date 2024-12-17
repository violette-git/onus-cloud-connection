import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface LinkingCodeDisplayProps {
  code: string;
}

export const LinkingCodeDisplay = ({ code }: LinkingCodeDisplayProps) => {
  const { toast } = useToast();

  useEffect(() => {
    if (code) {
      navigator.clipboard.writeText(code)
        .then(() => {
          toast({
            title: "Code copied!",
            description: "The linking code has been copied to your clipboard",
          });
        })
        .catch((error) => {
          console.error('Failed to copy code:', error);
          toast({
            variant: "destructive",
            title: "Failed to copy",
            description: "Please copy the code manually",
          });
        });
    }
  }, [code, toast]);

  return code ? (
    <div className="p-4 bg-muted rounded-md text-center border border-border">
      <p className="text-sm text-muted-foreground">Your linking code:</p>
      <p className="text-xl font-mono mt-2">{code}</p>
      <p className="text-sm text-muted-foreground mt-2">
        Code copied to clipboard! Use this code in the Suno extension on your profile page
      </p>
    </div>
  ) : null;
};