export default function KeywordChips({ items, getKey, getLabel, emptyText, live }) {
    if (!items.length) {
        return <p className="muted">{emptyText}</p>;
    }

    return (
        <div className="chips">
            {items.map((item, i) => (
                <span
                    className={`chip chip--enter ${live ? "chip--live" : ""}`}
                    key={getKey(item, i)}
                    style={{ animationDelay: `${i * 50}ms` }}
                >
                    {getLabel(item)}
                </span>
            ))}
        </div>
    );
}