import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
export const NudgeForm = ({ recipientId, onSuccess }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !message.trim())
            return;
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
    return (_jsx(Card, { className: "animate-fade-in", children: _jsx(CardContent, { className: "pt-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "relative", children: [_jsx(Textarea, { placeholder: "Type your message...", value: message, onChange: (e) => setMessage(e.target.value), maxLength: maxLength, className: "min-h-[100px] resize-none pr-16", disabled: isSending }), _jsxs("span", { className: "absolute bottom-2 right-2 text-xs text-muted-foreground", children: [characterCount, "/", maxLength] })] }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { type: "submit", disabled: isSending || !message.trim(), className: "transition-all duration-200 ease-in-out", children: isSending ? (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" }), "Sending..."] })) : (_jsxs(_Fragment, { children: [_jsx(Send, { className: "mr-2 h-4 w-4" }), "Send Message"] })) }) })] }) }) }));
};
