import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import { SunoPlayer } from "../SunoPlayer";
import { VideoEmbed } from "../VideoEmbed";
export const FeaturedContentItem = ({ item, songs, videos, isEditing, onRemove, onDragStart, onDragOver, }) => {
    const renderContent = () => {
        if (item.content_type === 'song') {
            const song = songs.find(s => s.id === item.content_id);
            if (!song)
                return null;
            return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-medium", children: song.title }), isEditing && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => onRemove(item.id), children: "Remove" }))] }), _jsx(SunoPlayer, { songId: song.url })] }));
        }
        if (item.content_type === 'video') {
            const video = videos.find(v => v.id === item.content_id);
            if (!video)
                return null;
            return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-medium", children: video.title }), isEditing && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => onRemove(item.id), children: "Remove" }))] }), _jsx(VideoEmbed, { video: video })] }));
        }
    };
    return (_jsxs("div", { className: "relative", draggable: isEditing, onDragStart: () => onDragStart(item), onDragOver: (e) => onDragOver(e, item), children: [isEditing && (_jsx("div", { className: "absolute -left-6 top-1/2 -translate-y-1/2 cursor-move", children: _jsx(GripVertical, { className: "h-5 w-5 text-muted-foreground" }) })), renderContent()] }));
};
