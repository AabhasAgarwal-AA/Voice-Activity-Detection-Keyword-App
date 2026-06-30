const API_URL = import.meta.env.VITE_API_URL;

export async function sendAudio(blob) {
    const form = new FormData();
    form.append("audio", blob, "speech.webm");

    const res = await fetch(`${API_URL}/api/keywords`, {
        method: "POST",
        body: form,
    });

    return res.json();
}