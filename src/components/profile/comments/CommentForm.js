import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
export const CommentForm = ({ onSubmit, isSubmitting, autoFocus = false, placeholder = "Write a comment..." }) => {
    const { user } = useAuth();
    const [content, setContent] = useState("");
    const handleSubmit = (e) => {
        e?.preventDefault();
        if (!content.trim())
            return;
        onSubmit(content.trim());
        setContent("");
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };
    if (!user) {
        return (_jsx("p", { className: "text-center text-muted-foreground", children: "Please sign in to post comments." }));
    }
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx(Textarea, { value: content, onChange: (e) => setContent(e.target.value), onKeyPress: handleKeyPress, placeholder: placeholder, className: "min-h-[100px]", autoFocus: autoFocus }), _jsx(Button, { type: "submit", disabled: isSubmitting, children: "Post Comment" })] }));
};
