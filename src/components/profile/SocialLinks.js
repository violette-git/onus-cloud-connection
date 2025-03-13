import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Linkedin, Youtube } from "lucide-react";
import { useState } from "react";
export const SocialLinksSection = ({ initialLinks, isOwner, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [socialLinks, setSocialLinks] = useState(initialLinks);
    const handleSave = async () => {
        await onSave(socialLinks);
        setIsEditing(false);
    };
    if (isEditing) {
        return (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Input, { placeholder: "Instagram URL", value: socialLinks.instagram, onChange: (e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value })), className: "w-48" }), _jsx(Input, { placeholder: "YouTube URL", value: socialLinks.youtube, onChange: (e) => setSocialLinks(prev => ({ ...prev, youtube: e.target.value })), className: "w-48" }), _jsx(Input, { placeholder: "LinkedIn URL", value: socialLinks.linkedin, onChange: (e) => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value })), className: "w-48" }), _jsx(Button, { onClick: handleSave, children: "Save" }), _jsx(Button, { variant: "outline", onClick: () => setIsEditing(false), children: "Cancel" })] }));
    }
    return (_jsxs("div", { className: "flex items-center space-x-4", children: [isOwner && (_jsx(Button, { variant: "outline", onClick: () => setIsEditing(true), children: "Edit Links" })), socialLinks.instagram && (_jsx("a", { href: socialLinks.instagram, target: "_blank", rel: "noopener noreferrer", className: "text-muted-foreground hover:text-foreground transition-colors", children: _jsx(Instagram, { className: "h-5 w-5" }) })), socialLinks.youtube && (_jsx("a", { href: socialLinks.youtube, target: "_blank", rel: "noopener noreferrer", className: "text-muted-foreground hover:text-foreground transition-colors", children: _jsx(Youtube, { className: "h-5 w-5" }) })), socialLinks.linkedin && (_jsx("a", { href: socialLinks.linkedin, target: "_blank", rel: "noopener noreferrer", className: "text-muted-foreground hover:text-foreground transition-colors", children: _jsx(Linkedin, { className: "h-5 w-5" }) }))] }));
};
