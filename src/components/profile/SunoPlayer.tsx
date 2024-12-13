import { useEffect, useRef, useState } from 'react';

interface SunoPlayerProps {
  songId: string;
  className?: string;
}

export const SunoPlayer = ({ songId, className }: SunoPlayerProps) => {
  const cdnUrl = `https://cdn1.suno.ai/${songId}.mp3`;
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    const context = new AudioContext();
    const source = context.createMediaElementSource(audioRef.current);
    const analyserNode = context.createAnalyser();
    
    analyserNode.fftSize = 256;
    source.connect(analyserNode);
    analyserNode.connect(context.destination);
    
    setAudioContext(context);
    setAnalyser(analyserNode);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      context.close();
    };
  }, []);

  const draw = () => {
    if (!canvasRef.current || !analyser) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, '#6B46C1');  // Purple
      gradient.addColorStop(1, '#ED64A6');  // Pink
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }

    animationRef.current = requestAnimationFrame(draw);
  };

  const handlePlay = () => {
    if (audioContext?.state === 'suspended') {
      audioContext.resume();
    }
    draw();
  };

  const handlePause = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div className={className}>
      <div className="space-y-2">
        <audio
          ref={audioRef}
          controls
          className="w-full rounded-lg"
          preload="metadata"
          onPlay={handlePlay}
          onPause={handlePause}
        >
          <source src={cdnUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <canvas 
          ref={canvasRef}
          className="w-full h-16 rounded-lg bg-secondary/10"
          width={800}
          height={100}
        />
      </div>
    </div>
  );
};