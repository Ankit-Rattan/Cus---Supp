import MessageBubble from './MessageBubble';

export default function ChatWindow({ messages, isSpeaking }) {
  return (
    <div
      style={{
        flex: 1,
        padding: 16,
        overflowY: 'auto',
        background: '#fafafa',
      }}
    >
      {messages.map((msg, idx) => (
        <MessageBubble
          key={idx}
          role={msg.role}
          text={msg.text}
        />
      ))}

      {/* Voice indicator */}
      <div
        style={{
          width: isSpeaking ? 80 : 50,
          height: isSpeaking ? 80 : 50,
          margin: '20px auto',
          borderRadius: '50%',
          background: isSpeaking ? '#ef4444' : '#22c55e',
          transition: 'all 0.3s ease',
        }}
      />
    </div>
  );
}
    