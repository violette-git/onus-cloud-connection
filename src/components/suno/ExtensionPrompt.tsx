import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download } from "lucide-react";

interface ExtensionPromptProps {
  onSkip: () => void;
  extensionUrl: string;
}

export const ExtensionPrompt = ({ onSkip, extensionUrl }: ExtensionPromptProps) => {
  return (
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
          onClick={() => window.open(extensionUrl, '_blank')}
        >
          <Download className="mr-2 h-4 w-4" />
          Install Suno Extension
        </Button>
        <Button 
          variant="link" 
          className="w-full"
          onClick={onSkip}
        >
          I already have the extension
        </Button>
      </AlertDescription>
    </Alert>
  );
};