import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { AssemblyAI } from "assemblyai";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 },
});

const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY,
});

app.get("/", (req, res) => {
    res.json({ ok: true, message: "AssemblyAI VAD API running" });
});

app.post("/api/keywords", upload.single("audio"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No audio file uploaded" });
        }

        const transcript = await client.transcripts.transcribe({
            audio: req.file.buffer,
            auto_highlights: true,
        });

        if (transcript.status === "error") {
            return res.status(500).json({ error: transcript.error });
        }

        const text = transcript.text || "";

        const keywords =
            transcript.auto_highlights_result?.results?.map((r) => r.text) || [];

        res.json({
            transcript: text,
            keywords,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);

/*
Keywords -
React
Node.js
MongoDB
AI
Machine Learning
API
Database
Google
Microsoft
Elon Musk
OpenAI
AssemblyAI
GitHub
Express
Vite
JavaScript
WebSocket
Docker
authentication
real-time processing
speech recognition
frontend
backend
performance
deploy
build
train
analyze
process
*/