import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { Video } from "@/types/profile";
import { useEffect, useRef } from "react";

interface VideoEmbedProps {
  video: Video;
}

export const VideoEmbed = ({ video }: VideoEmbedProps) => {
  const tiktokContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load TikTok embed script if it's a TikTok video
    if (video.platform === 'tiktok' && tiktokContainerRef.current) {
      const script = document.createElement('script');
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [video.platform]);

  if (video.platform === 'youtube') {
    const videoId = video.url.split('v=')[1]?.split('&')[0];
    if (!videoId) return null;

    return (
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </AspectRatio>
    );
  }

  if (video.platform === 'tiktok') {
    return (
      <div ref={tiktokContainerRef} className="tiktok-embed my-4">
        <blockquote 
          className="tiktok-embed" 
          cite={video.url}
          data-video-id={video.url.split('/video/')[1]?.split('?')[0]}
        >
          <section>
            <a href={video.url}>Loading TikTok video...</a>
          </section>
        </blockquote>
      </div>
    );
  }

  return null;
};