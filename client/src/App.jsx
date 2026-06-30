import { useEffect, useRef, useState } from "react";
import { sendAudio as postAudio } from "./services/api";
import ListenButton from "./components/ListenButton";
import KeywordChips from "./components/KeywordChips";
import TranscriptList from "./components/TranscriptList";
import AudioWave from "./components/AudioWave";
import StatusBar from "./components/StatusBar";
import "./App.css";

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [currentKeywords, setCurrentKeywords] = useState([]);
  const [transcripts, setTranscripts] = useState([]);
  const [activeStream, setActiveStream] = useState(null); // visual only

  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const intervalRef = useRef(null);

  const startListening = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    setActiveStream(stream); // visual only

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      chunksRef.current = [];
      await sendAudio(blob);
    };

    recorder.start();
    setIsListening(true);

    intervalRef.current = setInterval(() => {
      if (recorder.state === "recording") {
        recorder.stop();
        recorder.start();
      }
    }, 4000);
  };

  const stopListening = () => {
    setIsListening(false);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setActiveStream(null); // visual only
  };

  const sendAudio = async (blob) => {
    const data = await postAudio(blob);

    if (data.transcript) {
      setTranscripts((p) => [
        { id: crypto.randomUUID(), text: data.transcript },
        ...p,
      ]);
    }

    if (data.keywords?.length) {
      setCurrentKeywords(data.keywords);

      setKeywords((prev) => {
        const merged = [
          ...data.keywords.map((k) => ({ id: crypto.randomUUID(), word: k })),
          ...prev,
        ];
        return merged.slice(0, 30);
      });
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="page">
      <div className="aurora" aria-hidden />
      <main className="app">
        <header className="app__header">
          <h1>VAD Keyword App</h1>
          <p className="muted">
            Speak naturally — keywords are picked up in real time.
          </p>
        </header>

        <div className="hero">
          <StatusBar isListening={isListening} />
          <AudioWave stream={activeStream} active={isListening} />
          <ListenButton
            isListening={isListening}
            onStart={startListening}
            onStop={stopListening}
          />
        </div>

        <section className="panel">
          <h2>Live Keywords</h2>
          <KeywordChips
            items={currentKeywords}
            getKey={(_, i) => i}
            getLabel={(k) => k}
            emptyText="Listening for the latest chunk…"
            live
          />
        </section>

        <section className="panel">
          <h2>All Keywords</h2>
          <KeywordChips
            items={keywords}
            getKey={(k) => k.id}
            getLabel={(k) => k.word}
            emptyText="No keywords detected yet."
          />
        </section>

        <section className="panel">
          <h2>Transcript</h2>
          <TranscriptList transcripts={transcripts} />
        </section>
      </main>
    </div>
  );
}