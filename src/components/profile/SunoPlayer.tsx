interface SunoPlayerProps {
  songUrl: string;
  className?: string;
}

export const SunoPlayer = ({ songUrl, className }: SunoPlayerProps) => {
  // Convert regular Suno URL to embed URL
  const getEmbedUrl = (url: string) => {
    try {
      const songId = url.split('/song/')[1];
      return `https://suno.com/embed/song/${songId}`;
    } catch (error) {
      console.error('Invalid Suno URL:', error);
      return url;
    }
  };

  return (
    <div className={className}>
      <iframe
        src={getEmbedUrl(songUrl)}
        width="100%"
        height="166"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-lg"
      />
    </div>
  );
};