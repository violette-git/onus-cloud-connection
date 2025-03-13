import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { CommentForm } from "./CommentForm";
import { CommentHeader } from "./CommentHeader";
import { CommentReplyButton } from "./CommentReplyButton";
import { CommentConnector } from "./CommentConnector";
export const CommentItem = ({ comment, onDelete, onReply, depth = 0 }) => {
    const { user } = useAuth();
    const [isReplying, setIsReplying] = useState(false);
    const handleReply = (content) => {
        onReply(content, comment.id);
        setIsReplying(false);
    };
    const maxDepth = 5;
    const canReply = depth < maxDepth;
    const indentationWidth = 28;
    const marginLeft = depth * indentationWidth;
    return (_jsxs("div", { className: "relative", style: { marginLeft: `${marginLeft}px` }, children: [_jsx(CommentConnector, { depth: depth }), _jsx(Card, { className: "bg-secondary/50", children: _jsxs(CardContent, { className: "p-3", children: [_jsxs("div", { className: "flex justify-between items-start gap-2", children: [_jsxs("div", { className: "flex-1", children: [_jsx(CommentHeader, { user: comment.user, created_at: comment.created_at, canDelete: user?.id === comment.user_id, onDelete: () => onDelete(comment.id) }), _jsx("div", { className: "pl-10", children: _jsx("p", { className: "text-sm break-words", children: comment.content }) })] }), canReply && user && (_jsx(CommentReplyButton, { onReplyClick: () => setIsReplying(!isReplying), isReplying: isReplying }))] }), isReplying && (_jsx("div", { className: "mt-3", children: _jsx(CommentForm, { onSubmit: handleReply, isSubmitting: false, autoFocus: true, placeholder: "Write a reply..." }) }))] }) })] }));
};
