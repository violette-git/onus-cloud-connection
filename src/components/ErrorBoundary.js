import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
export class ErrorBoundary extends Component {
    state = {
        hasError: false
    };
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (_jsxs("div", { className: "min-h-[400px] flex flex-col items-center justify-center p-4", children: [_jsx(AlertTriangle, { className: "h-12 w-12 text-destructive mb-4" }), _jsx("h2", { className: "text-xl font-semibold mb-2", children: "Something went wrong" }), _jsx("p", { className: "text-muted-foreground mb-4", children: this.state.error?.message || "An unexpected error occurred" }), _jsx(Button, { onClick: () => {
                            this.setState({ hasError: false });
                            window.location.reload();
                        }, children: "Try again" })] }));
        }
        return this.props.children;
    }
}
