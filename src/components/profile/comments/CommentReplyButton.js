import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
export const CommentReplyButton = ({ onReplyClick, isReplying }) => {
    return (_jsxs(Button, { variant: "ghost", size: "sm", className: "text-muted-foreground h-7 text-xs px-2 shrink-0", onClick: () => onReplyClick(), children: [_jsx(MessageSquare, { className: "h-3 w-3 mr-1" }), isReplying ? 'Cancel' : 'Reply'] }));
};
