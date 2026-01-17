export default function ChatInput({ value, setValue, onSend, onTyping }) {
  return (
    <div
      style={{
        padding: 12,
        borderTop: '1px solid #eee',
        display: 'flex',
        gap: 8,
      }}
    >
      <input
        value={value}
        placeholder="Type here..."
        onChange={(e) => {
          setValue(e.target.value);
          onTyping();
        }}
        style={{
          flex: 1,
          padding: 10,
          borderRadius: 8,
          border: '1px solid #ccc',
        }}
      />
      <button
        onClick={onSend}
        style={{
          padding: '0 14px',
          borderRadius: 8,
          border: 'none',
          background: '#111827',
          color: '#fff',
        }}
      >
        →
      </button>
    </div>
  );
}
