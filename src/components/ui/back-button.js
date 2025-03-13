import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
export const BackButton = () => {
    const navigate = useNavigate();
    return (_jsxs(Button, { variant: "ghost", size: "sm", className: "mb-4", onClick: () => navigate(-1), children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back"] }));
};
