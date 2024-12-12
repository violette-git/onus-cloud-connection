interface SunoPlayerProps {
  songId: string;
  className?: string;
}

export const SunoPlayer = ({ songId, className }: SunoPlayerProps) => {
  return (
    <div className={className}>
      <iframe
        src={`https://suno.com/embed/song/${songId}`}
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