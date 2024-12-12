interface SunoPlayerProps {
  songUrl: string;
  className?: string;
}

export const SunoPlayer = ({ songUrl, className }: SunoPlayerProps) => {
  return (
    <div className={className}>
      <audio
        controls
        className="w-full rounded-lg"
        preload="metadata"
      >
        <source src={songUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};