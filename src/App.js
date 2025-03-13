import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Index } from "@/pages/Index";
import { Explore } from "@/pages/Explore";
import { Musicians } from "@/pages/Musicians";
import { MusicianProfile } from "@/pages/MusicianProfile";
import { Profile } from "@/pages/Profile";
import { Settings } from "@/pages/Settings";
import { Notifications } from "@/pages/Notifications";
import { Connections } from "@/pages/Connections";
import { Messages } from "@/pages/Messages";
import { MessageThread } from "@/pages/MessageThread";
import { Comments } from "@/pages/Comments";
import Forum from "@/pages/Forum";
const queryClient = new QueryClient();
function App() {
    return (_jsx(Router, { children: _jsx(ThemeProvider, { children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(AuthProvider, { children: _jsxs("div", { className: "min-h-screen bg-background text-foreground flex flex-col", children: [_jsx(Navbar, {}), _jsx("main", { className: "flex-grow", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Index, {}) }), _jsx(Route, { path: "/explore", element: _jsx(Explore, {}) }), _jsx(Route, { path: "/musicians", element: _jsx(Musicians, {}) }), _jsx(Route, { path: "/musicians/:id", element: _jsx(MusicianProfile, {}) }), _jsx(Route, { path: "/profile", element: _jsx(Profile, {}) }), _jsx(Route, { path: "/settings", element: _jsx(Settings, {}) }), _jsx(Route, { path: "/notifications", element: _jsx(Notifications, {}) }), _jsx(Route, { path: "/connections", element: _jsx(Connections, {}) }), _jsx(Route, { path: "/messages", element: _jsx(Messages, {}) }), _jsx(Route, { path: "/messages/:id", element: _jsx(MessageThread, {}) }), _jsx(Route, { path: "/comments/:type/:id", element: _jsx(Comments, {}) }), _jsx(Route, { path: "/forum", element: _jsx(Forum, {}) })] }) }), _jsx(Footer, {}), _jsx(Toaster, {})] }) }) }) }) }));
}
export default App;
