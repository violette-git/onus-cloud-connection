import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export const CommentButton = ({ contentId, contentType, count = 0 }) => {
    const navigate = useNavigate();
    return (_jsxs(Button, { variant: "ghost", size: "sm", className: "text-muted-foreground hover:text-foreground", onClick: () => navigate(`/comments/${contentType}/${contentId}`), children: [_jsx(MessageSquare, { className: "h-4 w-4 mr-1" }), count, " Comments"] }));
};
