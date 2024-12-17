import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const SUNO_EXTENSION_URL = "https://chrome.google.com/webstore/detail/suno-extension/[extension-id]";
const SUNO_ME_URL = "https://suno.com/me";

const passwordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

export const LinkSunoAccount = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [linkingCode, setLinkingCode] = useState("");
  const [showExtensionPrompt, setShowExtensionPrompt] = useState(true);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [sunoDetails, setSunoDetails] = useState<{ username: string; email: string } | null>(null);

  const form = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

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

      console.log('Linking code generated:', data.code);
      setLinkingCode(data.code);
      toast({
        title: "Linking code generated",
        description: "Use this code in the Suno extension to link your account",
      });
      
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

  const onPasswordSubmit = async (values: PasswordForm) => {
    if (!sunoDetails) return;

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: sunoDetails.email,
        password: values.password,
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Success!",
        description: "Your account has been created and linked to Suno.",
      });

      setShowPasswordDialog(false);
      navigate('/profile');
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not create account. Please try again.",
      });
    }
  };

  useEffect(() => {
    const handleExtensionMessage = async (event: MessageEvent) => {
      if (event.data.type === 'SUNO_ACCOUNT_LINKED' && event.data.sunoUsername && event.data.sunoEmail) {
        setSunoDetails({
          username: event.data.sunoUsername,
          email: event.data.sunoEmail
        });
        setShowPasswordDialog(true);
      }
    };

    window.addEventListener('message', handleExtensionMessage);
    return () => window.removeEventListener('message', handleExtensionMessage);
  }, [navigate, toast]);

  return (
    <>
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
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Linking Code'
              )}
            </Button>
            
            {linkingCode && (
              <div className="p-4 bg-muted rounded-md text-center border border-border">
                <p className="text-sm text-muted-foreground">Your linking code:</p>
                <p className="text-xl font-mono mt-2">{linkingCode}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Use this code in the Suno extension on your profile page
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Your Password</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};