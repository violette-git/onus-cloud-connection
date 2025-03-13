import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
export const CommentHeader = ({ user, created_at, canDelete, onDelete }) => {
    // Prioritize musician name if available
    const displayName = user.musician?.name || user.username || user.full_name;
    return (_jsxs("div", { className: "flex justify-between items-start gap-2", children: [_jsxs("div", { className: "flex gap-2 items-start flex-1 min-w-0", children: [_jsxs(Avatar, { className: "h-8 w-8", children: [_jsx(AvatarImage, { src: user.avatar_url, alt: displayName }), _jsx(AvatarFallback, { children: _jsx(User, { className: "h-4 w-4" }) })] }), _jsx("div", { className: "flex-1 min-w-0", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("p", { className: "font-medium text-sm truncate", children: displayName }), _jsx("p", { className: "text-xs text-muted-foreground", children: formatDistanceToNow(new Date(created_at), {
                                        addSuffix: true,
                                    }) })] }) })] }), canDelete && (_jsx(Button, { variant: "ghost", size: "icon", onClick: onDelete, className: "text-destructive hover:text-destructive h-8 w-8", children: _jsx(Trash2, { className: "h-3 w-3" }) }))] }));
};
