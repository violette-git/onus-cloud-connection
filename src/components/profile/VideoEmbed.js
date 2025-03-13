import { jsx as _jsx } from "react/jsx-runtime";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useEffect, useRef } from "react";
export const VideoEmbed = ({ video }) => {
    const tiktokContainerRef = useRef(null);
    useEffect(() => {
        // Load TikTok embed script if it's a TikTok video
        if (video.platform === 'tiktok' && tiktokContainerRef.current) {
            // Handle tiktok platform
            const script = document.createElement('script');
            script.src = 'https://www.tiktok.com/embed.js';
            script.async = true;
            document.body.appendChild(script);
            return () => {
                document.body.removeChild(script);
            };
        }
    }, [video.platform]);
    const getYoutubeVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };
    if (video.platform === 'youtube') {
        const videoId = getYoutubeVideoId(video.url);
        if (!videoId)
            return null;
        return (_jsx(AspectRatio, { ratio: 16 / 9, className: "overflow-hidden rounded-lg", children: _jsx("iframe", { src: `https://www.youtube.com/embed/${videoId}`, allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true, className: "w-full h-full" }) }));
    }
    if (video.platform === 'tiktok') {
        // Handle tiktok platform
        return (_jsx("div", { ref: tiktokContainerRef, className: "tiktok-embed", children: _jsx("blockquote", { className: "tiktok-embed", cite: video.url, "data-video-id": video.url.split('/video/')[1]?.split('?')[0], children: _jsx("section", { children: _jsx("a", { href: video.url, children: "Loading TikTok video..." }) }) }) }));
    }
    return null;
};
