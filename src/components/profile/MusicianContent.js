import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Music2, Video } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CreateMusicianForm } from "./CreateMusicianForm";
import { SongManager } from "./SongManager";
import { VideoManager } from "./VideoManager";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Connections } from "./Connections";
export const MusicianContent = ({ musician, onProfileCreated }) => {
    const { user } = useAuth();
    if (!musician && user) {
        return (_jsxs("div", { className: "max-w-xl mx-auto mt-12", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h2", { className: "text-2xl font-semibold mb-2", children: "Create Your Musician Profile" }), _jsx("p", { className: "text-muted-foreground", children: "Set up your musician profile to start sharing your music and connecting with fans" })] }), _jsx(CreateMusicianForm, { userId: user.id, onSuccess: () => onProfileCreated?.() })] }));
    }
    if (!musician)
        return null;
    const isOwner = user?.id === musician.user_id;
    const hasSongs = musician.songs && musician.songs.length > 0;
    const hasVideos = musician.videos && musician.videos.length > 0;
    const hasContent = hasSongs || hasVideos;
    return (_jsxs("div", { className: "mt-12 space-y-8", children: [musician.bio && (_jsx(Card, { children: _jsxs(CardContent, { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "Bio" }), _jsx("p", { className: "text-muted-foreground", children: musician.bio })] }) })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(Music2, { className: "h-5 w-5 text-muted-foreground" }), _jsx("h2", { className: "text-xl font-semibold", children: "My Songs" })] }), _jsx(ScrollArea, { className: "h-[400px]", children: _jsx("div", { className: "pr-4", children: isOwner && (_jsx(SongManager, { musicianId: musician.id, songs: musician.songs || [] })) }) })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(Video, { className: "h-5 w-5 text-muted-foreground" }), _jsx("h2", { className: "text-xl font-semibold", children: "My Videos" })] }), _jsx(ScrollArea, { className: "h-[400px]", children: _jsx("div", { className: "pr-4", children: isOwner && (_jsx(VideoManager, { musicianId: musician.id, videos: musician.videos || [] })) }) })] }) })] }), !hasContent && (_jsxs("div", { className: "text-center py-12", children: [_jsxs("div", { className: "flex justify-center space-x-4", children: [_jsx(Music2, { className: "h-12 w-12 text-muted-foreground" }), _jsx(Video, { className: "h-12 w-12 text-muted-foreground" })] }), _jsx("p", { className: "text-muted-foreground mt-4", children: "No content added yet" })] })), isOwner && (_jsx(Card, { children: _jsxs(CardContent, { className: "p-6", children: [_jsx("h3", { className: "font-semibold mb-4", children: "My Network" }), _jsx(ScrollArea, { className: "h-[300px]", children: _jsx(Connections, { userId: user.id }) })] }) }))] }));
};
