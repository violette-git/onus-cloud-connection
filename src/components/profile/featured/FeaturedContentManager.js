import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
export const FeaturedContentManager = ({ songs, videos, featuredSongs, featuredVideos, onAddSong, onAddVideo, }) => {
    const canAddSong = featuredSongs < 3;
    const canAddVideo = featuredVideos < 1;
    if (!canAddSong && !canAddVideo)
        return null;
    return (_jsx(ScrollArea, { className: "h-[200px]", children: _jsxs("div", { className: "space-y-4 p-4", children: [canAddSong && (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "Add Songs (up to 3)" }), _jsx("div", { className: "flex flex-wrap gap-2", children: songs.map((song) => (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => onAddSong(song.id), className: "flex items-center", children: [_jsx(Plus, { className: "h-4 w-4 mr-1" }), song.title] }, song.id))) })] })), canAddVideo && (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "Add Video (1 max)" }), _jsx("div", { className: "flex flex-wrap gap-2", children: videos.map((video) => (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => onAddVideo(video.id), className: "flex items-center", children: [_jsx(Plus, { className: "h-4 w-4 mr-1" }), video.title] }, video.id))) })] }))] }) }));
};
