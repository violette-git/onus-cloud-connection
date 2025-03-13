import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
export const LinkingCodeDisplay = ({ code }) => {
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
    return code ? (_jsxs("div", { className: "p-4 bg-muted rounded-md text-center border border-border", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Your linking code:" }), _jsx("p", { className: "text-xl font-mono mt-2", children: code }), _jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "Code copied to clipboard! Use this code in the Suno extension on your profile page" })] })) : null;
};
