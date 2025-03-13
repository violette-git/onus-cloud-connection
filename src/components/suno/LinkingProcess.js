import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ExternalLink } from "lucide-react";
import { LinkingCodeDisplay } from "./LinkingCodeDisplay";
export const LinkingProcess = ({ onSunoDetails, onLinkingCode, isLoading = false }) => {
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
            if (error)
                throw error;
            const code = data.code;
            console.log("LinkingProcess: Generated code:", code);
            setLinkingCode(code);
            onLinkingCode(code); // Pass the code back up to parent
        }
        catch (error) {
            console.error('LinkingProcess: Error generating linking code:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not generate linking code. Please try again.",
            });
        }
        finally {
            setLoading(false);
        }
    };
    const openSunoProfile = () => {
        window.open('https://suno.ai/me', '_blank', 'noopener,noreferrer');
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(Button, { onClick: generateLinkingCode, disabled: loading || isLoading, className: "w-full", children: loading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Generating..."] })) : isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Waiting for connection..."] })) : ('Generate Linking Code') }), linkingCode && (_jsxs(_Fragment, { children: [_jsx(LinkingCodeDisplay, { code: linkingCode }), _jsxs(Button, { onClick: openSunoProfile, variant: "outline", className: "w-full", disabled: isLoading, children: [_jsx(ExternalLink, { className: "mr-2 h-4 w-4" }), "Open Suno Profile"] })] }))] }));
};
