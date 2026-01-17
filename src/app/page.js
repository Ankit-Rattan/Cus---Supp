'use client';

import { useState } from 'react';
import { useConversation } from '@elevenlabs/react';

export default function VoiceSDKPage() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isCalling, setIsCalling] = useState(false);

  // 🔹 TEXT AGENT
  const textAgent = useConversation({
    onMessage: (msg) => {
      if (msg?.message) {
        setMessages((prev) => [
          ...prev,
          {
            role: msg.source === 'user' ? 'user' : 'agent',
            text: msg.message,
          },
        ]);
      }
    },
  });

  // 🔹 VOICE AGENT
  const voiceAgent = useConversation();

  /* ---------- TEXT ---------- */
  async function sendText() {
    if (!text.trim()) return;

    const userText = text;
    setText('');

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: userText },
    ]);

    if (textAgent.status !== 'connected') {
      await textAgent.startSession({
        agentId: process.env.NEXT_PUBLIC_TEXT_AGENT_ID,
        connectionType: 'websocket',
        overrides: {
          conversation: { textOnly: true },
        },
      });
    }

    textAgent.sendUserMessage(userText);
  }

  /* ---------- VOICE ---------- */
  async function startCall() {
    setIsCalling(true);
    setMessages([]);

    await navigator.mediaDevices.getUserMedia({ audio: true });

    await voiceAgent.startSession({
      agentId: process.env.NEXT_PUBLIC_VOICE_AGENT_ID,
      connectionType: 'webrtc',
    });
  }

  async function endCall() {
    setIsCalling(false);
    await voiceAgent.endSession();
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* HEADER */}
        <div style={styles.header}>
          <strong>Domino’s Support (Raman)</strong>
          {!isCalling ? (
            <button onClick={startCall}>Call</button>
          ) : (
            <button onClick={endCall}>End</button>
          )}
        </div>

        {/* CHAT */}
        <div style={styles.chat}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.bubble,
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                background: m.role === 'user' ? '#111827' : '#e5e7eb',
                color: m.role === 'user' ? '#fff' : '#000',
              }}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div style={styles.inputBar}>
          <input
            value={text}
            placeholder="Type your message..."
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendText()}
            disabled={isCalling}
            style={styles.input}
          />
          <button onClick={sendText} disabled={isCalling}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */
const styles = {
  page: {
    minHeight: '100vh',
    background: '#eaf6ff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 420,
    height: 560,
    background: '#fff',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: 16,
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
  },
  chat: {
    flex: 1,
    padding: 16,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  bubble: {
    maxWidth: '70%',
    padding: '10px 14px',
    borderRadius: 12,
  },
  inputBar: {
    padding: 12,
    borderTop: '1px solid #eee',
    display: 'flex',
    gap: 8,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
  },
};
