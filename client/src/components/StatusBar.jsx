import { useEffect, useRef, useState } from "react";

function format(s) {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
}

export default function StatusBar({ isListening }) {
    const [seconds, setSeconds] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isListening) {
            setSeconds(0);
            timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isListening]);

    return (
        <div className={`status ${isListening ? "status--live" : ""}`}>
            <span className="status__dot" />
            <span className="status__label">
                {isListening ? "Listening" : "Idle"}
            </span>
            <span className="status__time">{format(seconds)}</span>
        </div>
    );
}