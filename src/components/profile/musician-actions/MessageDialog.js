import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NudgeForm } from "@/components/messaging/NudgeForm";
export const MessageDialog = ({ recipientId, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (_jsxs(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: [_jsx(DialogTrigger, { asChild: true, children: children }), _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Send a Message" }) }), _jsx(NudgeForm, { recipientId: recipientId, onSuccess: () => setIsOpen(false) })] })] }));
};
