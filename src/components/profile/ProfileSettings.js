import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
export const ProfileSettings = ({ profile, onUpdate, isLoading }) => {
    const [handle, setHandle] = useState(profile.handle || '');
    const [visibility, setVisibility] = useState(profile.visibility || 'public');
    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate({
            id: profile.id,
            handle: handle || null,
            visibility
        });
    };
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Profile Settings" }), _jsx(CardDescription, { children: "Customize your profile URL and privacy settings" })] }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "handle", children: "Profile Handle" }), _jsx(Input, { id: "handle", placeholder: "your-unique-handle", value: handle, onChange: (e) => setHandle(e.target.value) }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["This will be your unique URL: /profile/", handle || '[handle]'] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "visibility", children: "Profile Visibility" }), _jsxs(Select, { value: visibility, onValueChange: (value) => setVisibility(value), children: [_jsx(SelectTrigger, { id: "visibility", children: _jsx(SelectValue, { placeholder: "Select visibility" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "public", children: "Public" }), _jsx(SelectItem, { value: "private", children: "Private" }), _jsx(SelectItem, { value: "followers", children: "Followers Only" })] })] })] }), _jsx(Button, { type: "submit", disabled: isLoading, children: "Save Settings" })] }) })] }));
};
