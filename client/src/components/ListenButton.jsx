export default function ListenButton({ isListening, onStart, onStop }) {
    return (
        <button
            type="button"
            className={`listen-btn ${isListening ? "is-active" : ""}`}
            onClick={isListening ? onStop : onStart}
        >
            <span className="listen-btn__ring" />
            <span className="listen-btn__icon">{isListening ? "■" : "●"}</span>
            {isListening ? "Stop" : "Start"}
        </button>
    );
}