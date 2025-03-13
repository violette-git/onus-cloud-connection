import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export const ThemeCustomization = ({ profile, onUpdate }) => {
    const [colors, setColors] = useState(profile.theme_colors);
    const [isUpdating, setIsUpdating] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            await onUpdate(colors);
        }
        finally {
            setIsUpdating(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "primary", className: "block text-sm font-medium mb-1", children: "Primary Color" }), _jsx(Input, { id: "primary", type: "color", value: colors.primary, onChange: (e) => setColors({ ...colors, primary: e.target.value }), className: "h-10 w-full" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "secondary", className: "block text-sm font-medium mb-1", children: "Secondary Color" }), _jsx(Input, { id: "secondary", type: "color", value: colors.secondary, onChange: (e) => setColors({ ...colors, secondary: e.target.value }), className: "h-10 w-full" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "accent", className: "block text-sm font-medium mb-1", children: "Accent Color" }), _jsx(Input, { id: "accent", type: "color", value: colors.accent, onChange: (e) => setColors({ ...colors, accent: e.target.value }), className: "h-10 w-full" })] }), _jsx(Button, { type: "submit", disabled: isUpdating, children: isUpdating ? "Updating..." : "Update Colors" })] }));
};
