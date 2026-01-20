'use client';

import { useState, useRef, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
import Image from 'next/image';

// Phone Icon
const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

// Send Icon
const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

// End Call Icon
const EndCallIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/>
    <line x1="23" y1="1" x2="1" y2="23"/>
  </svg>
);

// Headset Icon for Support Agent
const HeadsetIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
);

// Message Icon
const MessageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

export default function VoiceSDKPage() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const chatEndRef = useRef(null);
  const callTimerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Call duration timer
  useEffect(() => {
    if (isCalling) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(callTimerRef.current);
      setCallDuration(0);
    }
    return () => clearInterval(callTimerRef.current);
  }, [isCalling]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
      {/* Background Image */}
      <div style={styles.bgImage}>
        <Image
          src="/pizza-bg.jpg"
          alt="Pizza background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div style={styles.bgOverlay} />
      </div>
      
      {/* Main Container */}
      <div style={styles.container}>
        {/* Header Bar with Logo */}
        <div style={styles.topBar}>
          <div style={styles.logoSection}>
            <Image
              src="/dominos-logo.png"
              alt="Domino's Logo"
              width={180}
              height={60}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <div style={styles.supportBadge}>
            <MessageIcon />
            <span>Customer Support</span>
          </div>
        </div>

        {/* Chat Card */}
        <div style={styles.card}>
          {/* ================= CALL UI ================= */}
          {isCalling ? (
            <div style={styles.callScreen}>
              {/* Animated Background Circles */}
              <div style={styles.callBgCircle1} />
              <div style={styles.callBgCircle2} />
              
              {/* Agent Avatar */}
              <div style={styles.agentAvatarLarge}>
                <HeadsetIcon />
              </div>

              <div style={styles.callerInfo}>
                <div style={styles.callerName}>Raman</div>
                <div style={styles.callerRole}>Domino's Pizza Support</div>
                <div style={styles.callDuration}>{formatDuration(callDuration)}</div>
              </div>

              {/* Voice Indicator */}
              <div style={styles.voiceIndicator}>
                <div style={styles.voiceBar} />
                <div style={{...styles.voiceBar, animationDelay: '0.1s'}} />
                <div style={{...styles.voiceBar, animationDelay: '0.2s'}} />
                <div style={{...styles.voiceBar, animationDelay: '0.3s'}} />
                <div style={{...styles.voiceBar, animationDelay: '0.4s'}} />
              </div>

              <button style={styles.endCallBtn} onClick={endCall}>
                <EndCallIcon />
                <span>End Call</span>
              </button>
            </div>
          ) : (
            <>
              {/* ================= HEADER ================= */}
              <div style={styles.header}>
                <div style={styles.headerLeft}>
                  <div style={styles.agentAvatar}>
                    <HeadsetIcon />
                  </div>
                  <div style={styles.headerInfo}>
                    <div style={styles.headerTitle}>Domino's Support</div>
                    <div style={styles.headerStatus}>
                      <span style={styles.statusDot} />
                      Online • Ready to help
                    </div>
                  </div>
                </div>
                <button style={styles.callBtn} onClick={startCall}>
                  <PhoneIcon />
                  <span>Call Now</span>
                </button>
              </div>

              {/* ================= WELCOME MESSAGE ================= */}
              {messages.length === 0 && (
                <div style={styles.welcomeSection}>
                  <div style={styles.welcomeIcon}>🍕</div>
                  <h2 style={styles.welcomeTitle}>Welcome to Domino's Support!</h2>
                  <p style={styles.welcomeText}>
                    How can we help you today? Ask us about orders, deliveries, 
                    feedback, or anything else.
                  </p>
                  <div style={styles.quickActions}>
                    <button 
                      style={styles.quickBtn}
                      onClick={() => setText("Where is my order?")}
                    >
                      📦 Track Order
                    </button>
                    <button 
                      style={styles.quickBtn}
                      onClick={() => setText("I have a complaint about my delivery")}
                    >
                      ⚠️ Report Issue
                    </button>
                    <button 
                      style={styles.quickBtn}
                      onClick={() => setText("I want to give feedback")}
                    >
                      ⭐ Feedback
                    </button>
                  </div>
                </div>
              )}

              {/* ================= CHAT ================= */}
              <div style={styles.chat}>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.messageRow,
                      justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                      animation: 'fadeIn 0.3s ease-out',
                    }}
                  >
                    {m.role === 'agent' && (
                      <div style={styles.agentAvatarSmall}>
                        <span>🍕</span>
                      </div>
                    )}
                    <div
                      style={{
                        ...styles.bubble,
                        ...(m.role === 'user' ? styles.userBubble : styles.agentBubble),
                      }}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* ================= INPUT ================= */}
              <div style={styles.inputBar}>
                <input
                  value={text}
                  placeholder="Type your message here..."
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendText()}
                  style={styles.input}
                />
                <button 
                  style={{
                    ...styles.sendBtn,
                    opacity: text.trim() ? 1 : 0.6,
                  }} 
                  onClick={sendText}
                  disabled={!text.trim()}
                >
                  <SendIcon />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <span>Customer Care: </span>
          <strong>1800-208-1234</strong>
          <span style={styles.footerDivider}>|</span>
          <span>guestcaredominos@jublfood.com</span>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },

  bgImage: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },

  bgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0, 100, 145, 0.92) 0%, rgba(0, 60, 90, 0.95) 100%)',
    zIndex: 1,
  },

  container: {
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    position: 'relative',
    zIndex: 2,
  },

  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 8px',
  },

  logoSection: {
    display: 'flex',
    alignItems: 'center',
  },

  supportBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    padding: '8px 14px',
    borderRadius: 20,
    color: '#fff',
    fontSize: 13,
    fontWeight: 500,
  },

  card: {
    background: '#fff',
    borderRadius: 20,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: 600,
  },

  /* ---------- HEADER ---------- */
  header: {
    padding: '16px 20px',
    background: 'linear-gradient(135deg, #E31837 0%, #C41230 100%)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },

  agentAvatar: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },

  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
  },

  headerStatus: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 6px #4ade80',
  },

  callBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    borderRadius: 25,
    border: '2px solid rgba(255, 255, 255, 0.3)',
    background: 'rgba(255, 255, 255, 0.15)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  /* ---------- WELCOME SECTION ---------- */
  welcomeSection: {
    padding: '30px 24px',
    textAlign: 'center',
    borderBottom: '1px solid #f0f0f0',
  },

  welcomeIcon: {
    fontSize: 48,
    marginBottom: 12,
  },

  welcomeTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: 8,
  },

  welcomeText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 1.5,
    marginBottom: 20,
  },

  quickActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },

  quickBtn: {
    padding: '10px 16px',
    borderRadius: 20,
    border: '1px solid #e5e7eb',
    background: '#f9fafb',
    color: '#374151',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  /* ---------- CHAT ---------- */
  chat: {
    flex: 1,
    padding: '16px 20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    background: '#fafbfc',
  },

  messageRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 8,
  },

  agentAvatarSmall: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#E31837',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    flexShrink: 0,
  },

  bubble: {
    maxWidth: '75%',
    padding: '12px 16px',
    borderRadius: 18,
    fontSize: 14,
    lineHeight: 1.5,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },

  userBubble: {
    background: 'linear-gradient(135deg, #006491 0%, #004D6E 100%)',
    color: '#fff',
    borderBottomRightRadius: 4,
  },

  agentBubble: {
    background: '#fff',
    color: '#1f2937',
    border: '1px solid #e5e7eb',
    borderBottomLeftRadius: 4,
  },

  /* ---------- INPUT ---------- */
  inputBar: {
    padding: '16px 20px',
    borderTop: '1px solid #f0f0f0',
    display: 'flex',
    gap: 12,
    background: '#fff',
  },

  input: {
    flex: 1,
    padding: '14px 18px',
    borderRadius: 25,
    border: '2px solid #e5e7eb',
    fontSize: 14,
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
  },

  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #E31837 0%, #C41230 100%)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(227, 24, 55, 0.3)',
    transition: 'all 0.2s ease',
  },

  /* ---------- CALL SCREEN ---------- */
  callScreen: {
    flex: 1,
    background: 'linear-gradient(180deg, #006491 0%, #004D6E 50%, #003854 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '50px 30px',
    position: 'relative',
    overflow: 'hidden',
  },

  callBgCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: '50%',
    background: 'rgba(227, 24, 55, 0.1)',
    top: -100,
    right: -100,
  },

  callBgCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.05)',
    bottom: 100,
    left: -50,
  },

  agentAvatarLarge: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    boxShadow: '0 0 0 15px rgba(255, 255, 255, 0.1), 0 0 0 30px rgba(255, 255, 255, 0.05)',
  },

  callerInfo: {
    textAlign: 'center',
  },

  callerName: {
    fontSize: 28,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 4,
  },

  callerRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
  },

  callDuration: {
    fontSize: 32,
    fontWeight: 600,
    color: '#fff',
    fontFamily: 'monospace',
  },

  voiceIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    height: 40,
  },

  voiceBar: {
    width: 4,
    height: '100%',
    background: '#4ade80',
    borderRadius: 2,
    animation: 'pulse 0.5s ease-in-out infinite alternate',
  },

  endCallBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: '18px 36px',
    borderRadius: 30,
    border: 'none',
    background: '#E31837',
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(227, 24, 55, 0.4)',
    transition: 'all 0.2s ease',
  },

  /* ---------- FOOTER ---------- */
  footer: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    padding: '8px 0',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
  },

  footerDivider: {
    margin: '0 12px',
    opacity: 0.5,
  },
};
