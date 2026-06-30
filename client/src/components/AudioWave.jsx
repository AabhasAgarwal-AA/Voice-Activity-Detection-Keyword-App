import { useEffect, useRef } from "react";

const BARS = 28;

export default function AudioWave({ stream, active }) {
    const containerRef = useRef(null);
    const rafRef = useRef(null);
    const audioCtxRef = useRef(null);

    useEffect(() => {
        if (!active || !stream) return;

        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioCtxRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);
        const bars = containerRef.current?.children ?? [];

        const tick = () => {
            analyser.getByteFrequencyData(data);
            for (let i = 0; i < bars.length; i++) {
                const v = data[i % data.length] / 255; // 0..1
                const scale = 0.15 + v * 0.85;
                bars[i].style.transform = `scaleY(${scale})`;
            }
            rafRef.current = requestAnimationFrame(tick);
        };
        tick();

        return () => {
            cancelAnimationFrame(rafRef.current);
            source.disconnect();
            analyser.disconnect();
            audioCtx.close();
        };
    }, [stream, active]);

    return (
        <div className={`wave ${active ? "wave--on" : ""}`} ref={containerRef}>
            {Array.from({ length: BARS }).map((_, i) => (
                <span className="wave__bar" key={i} style={{ animationDelay: `${i * 40}ms` }} />
            ))}
        </div>
    );
}