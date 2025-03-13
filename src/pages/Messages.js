import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { NudgeList } from "@/components/messaging/NudgeList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
export const Messages = () => {
    const { user } = useAuth();
    if (!user) {
        return (_jsx("div", { className: "pt-24", children: _jsx("div", { className: "onus-container", children: _jsx("p", { className: "text-center text-muted-foreground", children: "Please sign in to view your messages." }) }) }));
    }
    return (_jsx("div", { className: "pt-24", children: _jsxs("div", { className: "onus-container", children: [_jsx(BackButton, {}), _jsx("h1", { className: "text-3xl font-bold mb-8", children: "Messages" }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Your Conversations" }) }), _jsx(CardContent, { children: _jsx(NudgeList, {}) })] })] }) }));
};
