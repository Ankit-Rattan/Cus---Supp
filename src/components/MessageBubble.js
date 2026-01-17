export default function MessageBubble({ role, text }) {
  const isUser = role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 8,
      }}
    >
      <div
        style={{
          maxWidth: '75%',
          padding: '10px 14px',
          borderRadius: 12,
          background: isUser ? '#111827' : '#e5e7eb',
          color: isUser ? '#fff' : '#000',
          fontSize: 14,
        }}
      >
        {text}
      </div>
    </div>
  );
}
