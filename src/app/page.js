'use client';

import { useState, useRef, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
import Image from 'next/image';

// Customer Avatar SVG - Friendly cartoon character
const CustomerAvatar = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background circle */}
    <circle cx="60" cy="60" r="58" fill="url(#avatarGrad)" stroke="#E31837" strokeWidth="3"/>
    
    {/* Hair */}
    <ellipse cx="60" cy="35" rx="32" ry="20" fill="#4A3728"/>
    <path d="M28 45 Q30 25 60 22 Q90 25 92 45" fill="#4A3728"/>
    
    {/* Face */}
    <ellipse cx="60" cy="55" rx="28" ry="30" fill="#FFD5B8"/>
    
    {/* Eyes */}
    <ellipse cx="48" cy="50" rx="6" ry="7" fill="#fff"/>
    <ellipse cx="72" cy="50" rx="6" ry="7" fill="#fff"/>
    <circle cx="49" cy="51" r="3.5" fill="#3B2F2F"/>
    <circle cx="73" cy="51" r="3.5" fill="#3B2F2F"/>
    <circle cx="50" cy="49" r="1.5" fill="#fff"/>
    <circle cx="74" cy="49" r="1.5" fill="#fff"/>
    
    {/* Eyebrows */}
    <path d="M42 42 Q48 39 54 42" stroke="#4A3728" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M66 42 Q72 39 78 42" stroke="#4A3728" strokeWidth="2" strokeLinecap="round" fill="none"/>
    
    {/* Nose */}
    <path d="M60 55 Q62 60 60 63 Q58 60 60 55" fill="#E8B89D"/>
    
    {/* Smile */}
    <path d="M48 70 Q60 82 72 70" stroke="#C96A4B" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    
    {/* Cheeks */}
    <ellipse cx="40" cy="65" rx="6" ry="4" fill="#FFB6B6" opacity="0.6"/>
    <ellipse cx="80" cy="65" rx="6" ry="4" fill="#FFB6B6" opacity="0.6"/>
    
    {/* Body/Shirt */}
    <path d="M30 95 Q30 85 60 85 Q90 85 90 95 L90 120 L30 120 Z" fill="#006491"/>
    <path d="M50 85 L60 100 L70 85" fill="#E31837"/>
    
    <defs>
      <linearGradient id="avatarGrad" x1="0" y1="0" x2="120" y2="120">
        <stop offset="0%" stopColor="#FFF5F0"/>
        <stop offset="100%" stopColor="#FFE5DC"/>
      </linearGradient>
    </defs>
  </svg>
);

// Phone Icon
const PhoneIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

// Chat Icon
const ChatIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

// Send Icon
const SendIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
);

// End Call Icon
const EndCallIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
  </svg>
);

// Headset Icon
const HeadsetIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
);

// Domino Tile Icon for agent avatar
const DominoTileIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="18" height="40" rx="3" fill="#E31837" stroke="#fff" strokeWidth="2"/>
    <circle cx="13" cy="14" r="3" fill="#fff"/>
    <circle cx="13" cy="34" r="3" fill="#fff"/>
    <rect x="26" y="4" width="18" height="40" rx="3" fill="#006491" stroke="#fff" strokeWidth="2"/>
    <circle cx="35" cy="14" r="3" fill="#fff"/>
    <circle cx="35" cy="24" r="3" fill="#fff"/>
    <circle cx="35" cy="34" r="3" fill="#fff"/>
  </svg>
);

export default function CustomerSupportPage() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [mode, setMode] = useState('chat'); // 'chat' or 'call'
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const chatEndRef = useRef(null);
  const callTimerRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isCallActive) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(callTimerRef.current);
      setCallDuration(0);
    }
    return () => clearInterval(callTimerRef.current);
  }, [isCallActive]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const textAgent = useConversation({
    onMessage: (msg) => {
      if (msg?.message) {
        setMessages((prev) => [
          ...prev,
          { role: msg.source === 'user' ? 'user' : 'agent', text: msg.message },
        ]);
      }
    },
  });

  const voiceAgent = useConversation();

  async function sendText() {
    if (!text.trim()) return;
    const userText = text;
    setText('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);

    if (textAgent.status !== 'connected') {
      await textAgent.startSession({
        agentId: process.env.NEXT_PUBLIC_TEXT_AGENT_ID,
        connectionType: 'websocket',
        overrides: { conversation: { textOnly: true } },
      });
    }
    textAgent.sendUserMessage(userText);
  }

  async function startCall() {
    setIsCallActive(true);
    await navigator.mediaDevices.getUserMedia({ audio: true });
    await voiceAgent.startSession({
      agentId: process.env.NEXT_PUBLIC_VOICE_AGENT_ID,
      connectionType: 'webrtc',
    });
  }

  async function endCall() {
    setIsCallActive(false);
    await voiceAgent.endSession();
  }

  const switchToCall = () => {
    setMode('call');
    setMessages([]);
  };

  const switchToChat = () => {
    setMode('chat');
    if (isCallActive) {
      endCall();
    }
  };

  return (
    <div style={styles.page}>
      {/* Background */}
      <div style={styles.bgImage}>
        <Image src="/pizza-bg.jpg" alt="Background" fill style={{ objectFit: 'cover' }} priority />
        <div style={styles.bgOverlay} />
      </div>

      {/* Main Container */}
      <div style={styles.container}>
        {/* Logo Header */}
        <header style={styles.logoHeader}>
          <Image
            src="/dominos-logo.png"
            alt="Domino's"
            width={160}
            height={50}
            style={{ objectFit: 'contain' }}
            priority
          />
        </header>

        {/* Main Card */}
        <main style={styles.card}>
          {/* Mode Switcher */}
          <div style={styles.modeSwitcher}>
            <button
              style={{
                ...styles.modeBtn,
                ...(mode === 'chat' ? styles.modeBtnActive : {}),
              }}
              onClick={switchToChat}
            >
              <ChatIcon size={20} />
              <span>Chat</span>
            </button>
            <button
              style={{
                ...styles.modeBtn,
                ...(mode === 'call' ? styles.modeBtnActiveCall : {}),
              }}
              onClick={switchToCall}
            >
              <PhoneIcon size={20} />
              <span>Call</span>
            </button>
          </div>

          {mode === 'call' ? (
            /* ================= CALL MODE ================= */
            <div style={styles.callContainer}>
              {!isCallActive ? (
                /* Pre-call screen */
                <div style={styles.preCallScreen}>
                  <div style={styles.customerAvatarWrapper}>
                    <CustomerAvatar size={140} />
                  </div>
                  <h2 style={styles.callTitle}>Voice Support</h2>
                  <p style={styles.callSubtitle}>
                    Speak directly with our support agent for quick assistance
                  </p>
                  <button style={styles.startCallBtn} onClick={startCall}>
                    <PhoneIcon size={24} />
                    <span>Start Call</span>
                  </button>
                  <p style={styles.callNote}>🎧 Make sure your microphone is enabled</p>
                </div>
              ) : (
                /* Active call screen */
                <div style={styles.activeCallScreen}>
                  <div style={styles.callBgPattern} />
                  
                  <div style={styles.agentAvatarLarge}>
                    <HeadsetIcon size={50} />
                    <div style={styles.avatarRing} />
                    <div style={styles.avatarRing2} />
                  </div>

                  <div style={styles.callerInfo}>
                    <div style={styles.callerName}>Raman</div>
                    <div style={styles.callerRole}>Support Agent</div>
                  </div>

                  <div style={styles.callTimer}>
                    <div style={styles.timerDot} />
                    <span>{formatDuration(callDuration)}</span>
                  </div>

                  <div style={styles.voiceWave}>
                    {[...Array(7)].map((_, i) => (
                      <div key={i} style={{...styles.voiceBar, animationDelay: `${i * 0.1}s`}} />
                    ))}
                  </div>

                  <button style={styles.endCallBtn} onClick={endCall}>
                    <EndCallIcon />
                    <span>End Call</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ================= CHAT MODE ================= */
            <>
              {/* Chat Header */}
              <div style={styles.chatHeader}>
                <div style={styles.headerLeft}>
                  <div style={styles.agentAvatar}>
                    <HeadsetIcon size={22} />
                  </div>
                  <div>
                    <div style={styles.headerTitle}>Support Agent</div>
                    <div style={styles.headerStatus}>
                      <span style={styles.statusDot} />
                      <span>Online</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Welcome or Chat */}
              {messages.length === 0 ? (
                <div style={styles.welcomeSection}>
                  <div style={styles.customerAvatarWrapper}>
                    <CustomerAvatar size={120} />
                  </div>
                  <h2 style={styles.welcomeTitle}>Hi there! 👋</h2>
                  <p style={styles.welcomeText}>
                    Tell us about your concern and we'll help you right away.
                  </p>
                </div>
              ) : (
                <div style={styles.chat}>
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        ...styles.messageRow,
                        justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      {m.role === 'agent' && (
                        <div style={styles.agentAvatarSmall}>
                          <DominoTileIcon size={18} />
                        </div>
                      )}
                      <div style={m.role === 'user' ? styles.userBubble : styles.agentBubble}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              )}

              {/* Input */}
              <div style={styles.inputBar}>
                <input
                  value={text}
                  placeholder="Describe your issue..."
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendText()}
                  style={styles.input}
                />
                <button
                  style={{
                    ...styles.sendBtn,
                    opacity: text.trim() ? 1 : 0.5,
                  }}
                  onClick={sendText}
                  disabled={!text.trim()}
                >
                  <SendIcon />
                </button>
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <footer style={styles.footer}>
          <span>📞 1800-208-1234</span>
          <span style={styles.footerDot}>•</span>
          <span>We're here 24/7</span>
        </footer>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    minHeight: '100vh',
    minHeight: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 'clamp(12px, 3vw, 24px)',
    position: 'relative',
    overflow: 'hidden',
  },

  bgImage: {
    position: 'fixed',
    inset: 0,
    zIndex: 0,
  },

  bgOverlay: {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(
      135deg, 
      rgba(0, 100, 145, 0.95) 0%, 
      rgba(0, 74, 110, 0.97) 50%,
      rgba(0, 56, 84, 0.98) 100%
    )`,
  },

  container: {
    width: '100%',
    maxWidth: 'min(440px, 95vw)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(12px, 2vw, 16px)',
    position: 'relative',
    zIndex: 2,
  },

  logoHeader: {
    display: 'flex',
    justifyContent: 'center',
    padding: '8px 0',
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
  },

  card: {
    background: '#fff',
    borderRadius: 'clamp(20px, 5vw, 28px)',
    boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minHeight: 'clamp(520px, 68vh, 600px)',
  },

  /* Mode Switcher */
  modeSwitcher: {
    display: 'flex',
    padding: '12px',
    gap: '8px',
    background: '#f5f5f5',
    borderBottom: '1px solid #eee',
  },

  modeBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 'clamp(12px, 3vw, 16px)',
    borderRadius: 14,
    border: 'none',
    background: 'transparent',
    color: '#666',
    fontSize: 'clamp(14px, 3.5vw, 16px)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  modeBtnActive: {
    background: 'linear-gradient(135deg, #006491 0%, #004A6E 100%)',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(0, 100, 145, 0.4)',
  },

  modeBtnActiveCall: {
    background: 'linear-gradient(135deg, #E31837 0%, #C41230 100%)',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(227, 24, 55, 0.4)',
  },

  /* Chat Header */
  chatHeader: {
    padding: 'clamp(14px, 3vw, 18px) clamp(16px, 4vw, 22px)',
    background: 'linear-gradient(135deg, #E31837 0%, #C41230 100%)',
    display: 'flex',
    alignItems: 'center',
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },

  agentAvatar: {
    width: 'clamp(42px, 10vw, 48px)',
    height: 'clamp(42px, 10vw, 48px)',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 'clamp(15px, 3.8vw, 18px)',
    fontWeight: 700,
  },

  headerStatus: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 'clamp(11px, 2.8vw, 13px)',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 8px #4ade80',
  },

  /* Welcome Section */
  welcomeSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(30px, 6vw, 40px)',
    textAlign: 'center',
  },

  customerAvatarWrapper: {
    marginBottom: 20,
    filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.15))',
  },

  welcomeTitle: {
    fontSize: 'clamp(22px, 5.5vw, 28px)',
    fontWeight: 800,
    color: '#1f2937',
    marginBottom: 10,
  },

  welcomeText: {
    fontSize: 'clamp(14px, 3.5vw, 16px)',
    color: '#6b7280',
    lineHeight: 1.6,
    maxWidth: 280,
  },

  /* Chat */
  chat: {
    flex: 1,
    padding: 'clamp(14px, 3vw, 18px)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    background: '#fafbfc',
  },

  messageRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 10,
    animation: 'slideUp 0.4s ease-out forwards',
  },

  agentAvatarSmall: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #E31837 0%, #C41230 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  userBubble: {
    maxWidth: '78%',
    padding: 'clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 18px)',
    borderRadius: '20px 20px 4px 20px',
    fontSize: 'clamp(14px, 3.5vw, 15px)',
    lineHeight: 1.5,
    background: 'linear-gradient(135deg, #006491 0%, #005580 100%)',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(0, 100, 145, 0.25)',
  },

  agentBubble: {
    maxWidth: '78%',
    padding: 'clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 18px)',
    borderRadius: '20px 20px 20px 4px',
    fontSize: 'clamp(14px, 3.5vw, 15px)',
    lineHeight: 1.5,
    background: '#fff',
    color: '#1f2937',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },

  /* Input */
  inputBar: {
    padding: 'clamp(14px, 3vw, 18px)',
    borderTop: '1px solid #f0f0f0',
    display: 'flex',
    gap: 12,
    background: '#fff',
  },

  input: {
    flex: 1,
    padding: 'clamp(14px, 3.5vw, 16px) clamp(18px, 4.5vw, 22px)',
    borderRadius: 30,
    border: '2px solid #e5e7eb',
    fontSize: 'clamp(14px, 3.5vw, 15px)',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    background: '#fafbfc',
  },

  sendBtn: {
    width: 'clamp(50px, 13vw, 56px)',
    height: 'clamp(50px, 13vw, 56px)',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #E31837 0%, #C41230 100%)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 20px rgba(227, 24, 55, 0.4)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  /* Call Container */
  callContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  preCallScreen: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(30px, 6vw, 40px)',
    textAlign: 'center',
    background: 'linear-gradient(180deg, #fafbfc 0%, #f0f4f8 100%)',
  },

  callTitle: {
    fontSize: 'clamp(22px, 5.5vw, 26px)',
    fontWeight: 800,
    color: '#1f2937',
    marginBottom: 8,
  },

  callSubtitle: {
    fontSize: 'clamp(13px, 3.2vw, 15px)',
    color: '#6b7280',
    lineHeight: 1.5,
    marginBottom: 28,
    maxWidth: 260,
  },

  startCallBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 'clamp(16px, 4vw, 20px) clamp(32px, 8vw, 44px)',
    borderRadius: 40,
    border: 'none',
    background: 'linear-gradient(135deg, #E31837 0%, #C41230 100%)',
    color: '#fff',
    fontSize: 'clamp(16px, 4vw, 18px)',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 8px 30px rgba(227, 24, 55, 0.4)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  callNote: {
    marginTop: 20,
    fontSize: 'clamp(11px, 2.8vw, 13px)',
    color: '#9ca3af',
  },

  activeCallScreen: {
    flex: 1,
    background: 'linear-gradient(180deg, #006491 0%, #004A6E 40%, #003854 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 'clamp(40px, 8vw, 50px) clamp(20px, 5vw, 30px)',
    position: 'relative',
    overflow: 'hidden',
  },

  callBgPattern: {
    position: 'absolute',
    inset: 0,
    background: `
      radial-gradient(circle at 20% 20%, rgba(227, 24, 55, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
    `,
  },

  agentAvatarLarge: {
    width: 'clamp(100px, 25vw, 120px)',
    height: 'clamp(100px, 25vw, 120px)',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    position: 'relative',
    backdropFilter: 'blur(10px)',
  },

  avatarRing: {
    position: 'absolute',
    inset: -15,
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.2)',
    animation: 'pulse 2s ease-in-out infinite',
  },

  avatarRing2: {
    position: 'absolute',
    inset: -30,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.1)',
    animation: 'pulse 2s ease-in-out infinite 0.5s',
  },

  callerInfo: {
    textAlign: 'center',
  },

  callerName: {
    fontSize: 'clamp(26px, 6.5vw, 32px)',
    fontWeight: 800,
    color: '#fff',
    marginBottom: 4,
  },

  callerRole: {
    fontSize: 'clamp(13px, 3.2vw, 15px)',
    color: 'rgba(255, 255, 255, 0.75)',
  },

  callTimer: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 28px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: 30,
    fontSize: 'clamp(20px, 5vw, 24px)',
    fontWeight: 600,
    color: '#fff',
    fontFamily: 'monospace',
  },

  timerDot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 12px #4ade80',
    animation: 'pulse 1s infinite',
  },

  voiceWave: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 50,
  },

  voiceBar: {
    width: 6,
    background: 'linear-gradient(180deg, #4ade80 0%, #22c55e 100%)',
    borderRadius: 3,
    animation: 'voicePulse 0.6s ease-in-out infinite',
  },

  endCallBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 'clamp(16px, 4vw, 20px) clamp(32px, 8vw, 44px)',
    borderRadius: 40,
    border: 'none',
    background: 'linear-gradient(135deg, #E31837 0%, #C41230 100%)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 'clamp(15px, 3.8vw, 17px)',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(227, 24, 55, 0.5)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  /* Footer */
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'clamp(8px, 2vw, 12px)',
    padding: 'clamp(12px, 3vw, 16px)',
    background: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 14,
    backdropFilter: 'blur(10px)',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 'clamp(12px, 3vw, 14px)',
    fontWeight: 500,
  },

  footerDot: {
    opacity: 0.5,
  },
};
