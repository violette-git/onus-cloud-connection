import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
export const SunoPlayer = ({ songId, className }) => {
    const cdnUrl = `https://cdn1.suno.ai/${songId}.mp3`;
    const audioRef = useRef(null);
    const canvasRef = useRef(null);
    const animationRef = useRef();
    const [audioContext, setAudioContext] = useState(null);
    const [analyser, setAnalyser] = useState(null);
    useEffect(() => {
        if (!audioRef.current)
            return;
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
        if (!canvasRef.current || !analyser)
            return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height;
            const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
            gradient.addColorStop(0, '#6B46C1'); // Purple
            gradient.addColorStop(1, '#ED64A6'); // Pink
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
    return (_jsx("div", { className: className, children: _jsxs("div", { className: "space-y-2", children: [_jsxs("audio", { ref: audioRef, controls: true, className: "w-full rounded-lg", preload: "metadata", onPlay: handlePlay, onPause: handlePause, children: [_jsx("source", { src: cdnUrl, type: "audio/mpeg" }), "Your browser does not support the audio element."] }), _jsx("canvas", { ref: canvasRef, className: "w-full h-16 rounded-lg bg-secondary/10", width: 800, height: 100 })] }) }));
};
