interface SunoPlayerProps {
  songUrl: string;
  className?: string;
}

export const SunoPlayer = ({ songUrl, className }: SunoPlayerProps) => {
  return (
    <div className={className}>
      <iframe
        src={songUrl}
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