interface SunoPlayerProps {
  songId: string;
  className?: string;
}

export const SunoPlayer = ({ songId, className }: SunoPlayerProps) => {
  const cdnUrl = `https://cdn1.suno.ai/${songId}.mp3`;

  return (
    <div className={className}>
      <audio
        controls
        className="w-full rounded-lg"
        preload="metadata"
      >
        <source src={cdnUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};