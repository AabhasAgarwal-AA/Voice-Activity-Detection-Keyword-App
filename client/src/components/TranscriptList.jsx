export default function TranscriptList({ transcripts }) {
    if (!transcripts.length) {
        return <p className="muted">Nothing transcribed yet.</p>;
    }

    return (
        <ul className="transcript">
            {transcripts.map((t, i) => (
                <li
                    key={t.id}
                    className="transcript__item transcript__item--enter"
                    style={{ animationDelay: `${i === 0 ? 0 : 0}ms` }}
                >
                    {t.text}
                </li>
            ))}
        </ul>
    );
}