import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download } from "lucide-react";
export const ExtensionPrompt = ({ onSkip, extensionUrl }) => {
    return (_jsx(Alert, { children: _jsxs(AlertDescription, { className: "space-y-4", children: [_jsx("p", { children: "To link your Suno account, you'll need to:" }), _jsxs("ol", { className: "list-decimal pl-4 space-y-2", children: [_jsx("li", { children: "Install the Suno Chrome extension" }), _jsx("li", { children: "Generate a linking code" }), _jsx("li", { children: "Use the code in the extension on your Suno profile page" })] }), _jsxs(Button, { variant: "outline", className: "w-full", onClick: () => window.open(extensionUrl, '_blank'), children: [_jsx(Download, { className: "mr-2 h-4 w-4" }), "Install Suno Extension"] }), _jsx(Button, { variant: "link", className: "w-full", onClick: onSkip, children: "I already have the extension" })] }) }));
};
