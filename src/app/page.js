'use client';

import { useState } from 'react';
import { useConversation } from '@elevenlabs/react';

export default function VoiceSDKPage() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isCalling, setIsCalling] = useState(false);

  /* ---------- TEXT AGENT ---------- */
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

  /* ---------- VOICE AGENT ---------- */
  const voiceAgent = useConversation();

  /* ---------- TEXT ---------- */
  async function sendText() {
    if (!text.trim() || isCalling) return;

    const userText = text;
    setText('');

    setMessages((prev) => [...prev, { role: 'user', text: userText }]);

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
        {/* ================= CALL UI ================= */}
        {isCalling ? (
          <div style={styles.callScreen}>
            <div style={styles.callerName}>
              Raman
              <div style={styles.subText}>Domino’s Pizza Support</div>
            </div>

            <div style={styles.callStatus}>On Call…</div>

            <button style={styles.endCallBtn} onClick={endCall}>
              End Call
            </button>
          </div>
        ) : (
          <>
            {/* ================= HEADER ================= */}
            <div style={styles.header}>
              <strong>Domino’s Support</strong>
              <button style={styles.callBtn} onClick={startCall}>
                Call
              </button>
            </div>

            {/* ================= CHAT ================= */}
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

            {/* ================= INPUT ================= */}
            <div style={styles.inputBar}>
              <input
                value={text}
                placeholder="Type your message..."
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendText()}
                style={styles.input}
              />
              <button style={styles.sendBtn} onClick={sendText}>
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

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
    borderRadius: 14,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  /* ---------- HEADER ---------- */
  header: {
    padding: 16,
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  callBtn: {
    padding: '8px 18px',
    borderRadius: 20,
    border: 'none',
    background: '#dc2626',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },

  /* ---------- CHAT ---------- */
  chat: {
    flex: 1,
    padding: 16,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    background: '#fafafa',
  },

  bubble: {
    maxWidth: '70%',
    padding: '10px 14px',
    borderRadius: 12,
    fontSize: 14,
  },

  /* ---------- INPUT ---------- */
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

  sendBtn: {
    padding: '0 16px',
    borderRadius: 8,
    border: 'none',
    background: '#111827',
    color: '#fff',
    cursor: 'pointer',
  },

  /* ---------- CALL SCREEN ---------- */
  callScreen: {
    flex: 1,
    background: '#e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '60px 20px',
  },

  callerName: {
    fontSize: 22,
    fontWeight: 600,
    textAlign: 'center',
  },

  subText: {
    fontSize: 14,
    color: '#555',
    marginTop: 6,
  },

  callStatus: {
    fontSize: 16,
    color: '#444',
  },

  endCallBtn: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
