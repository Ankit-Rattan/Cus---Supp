'use client';

import { useState, useRef, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
import Image from 'next/image';

// Domino Tile Icon (Classic two-tile domino)
const DominoTileIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Red tile */}
    <rect x="4" y="4" width="18" height="40" rx="3" fill="#E31837" stroke="#fff" strokeWidth="2"/>
    <circle cx="13" cy="14" r="3" fill="#fff"/>
    <circle cx="13" cy="34" r="3" fill="#fff"/>
    {/* Blue tile */}
    <rect x="26" y="4" width="18" height="40" rx="3" fill="#006491" stroke="#fff" strokeWidth="2"/>
    <circle cx="35" cy="14" r="3" fill="#fff"/>
    <circle cx="35" cy="24" r="3" fill="#fff"/>
    <circle cx="35" cy="34" r="3" fill="#fff"/>
  </svg>
);

// Phone Icon
const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
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

// Chat Icon
const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

// Pizza Slice Icon
const PizzaIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.5 2 5.5 3.5 3.5 6L12 22L20.5 6C18.5 3.5 15.5 2 12 2Z" fill="#FFB347" stroke="#E31837" strokeWidth="1.5"/>
    <circle cx="10" cy="8" r="1.5" fill="#E31837"/>
    <circle cx="14" cy="10" r="1.5" fill="#E31837"/>
    <circle cx="11" cy="13" r="1.5" fill="#E31837"/>
    <circle cx="9" cy="10" r="1" fill="#4CAF50"/>
    <circle cx="14" cy="7" r="1" fill="#4CAF50"/>
  </svg>
);

export default function VoiceSDKPage() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isHoveringCall, setIsHoveringCall] = useState(false);
  const chatEndRef = useRef(null);
  const callTimerRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    if (!text.trim() || isCalling) return;
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
      {/* Background Image with Overlay */}
      <div style={styles.bgImage}>
        <Image
          src="/pizza-bg.jpg"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div style={styles.bgOverlay} />
      </div>

      {/* Floating decorative elements */}
      <div style={styles.floatingPizza1}><PizzaIcon /></div>
      <div style={styles.floatingPizza2}><PizzaIcon /></div>
      
      {/* Main Container */}
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.topBar}>
          <div style={styles.logoSection}>
            <div style={styles.logoWrapper}>
              <DominoTileIcon size={44} />
            </div>
            <div style={styles.brandTextWrapper}>
              <span style={styles.brandText}>Domino's</span>
              <span style={styles.brandSubtext}>Pizza</span>
            </div>
          </div>
          <div style={styles.supportBadge}>
            <ChatIcon />
            <span>24/7 Support</span>
          </div>
        </header>

        {/* Chat Card */}
        <main style={styles.card}>
          {isCalling ? (
            /* ================= CALL SCREEN ================= */
            <div style={styles.callScreen}>
              <div style={styles.callBgPattern} />
              
              <div style={styles.agentAvatarLarge}>
                <HeadsetIcon size={50} />
                <div style={styles.avatarRing} />
                <div style={styles.avatarRing2} />
              </div>

              <div style={styles.callerInfo}>
                <div style={styles.callerName}>Raman</div>
                <div style={styles.callerRole}>Domino's Support Agent</div>
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
          ) : (
            <>
              {/* ================= HEADER ================= */}
              <div style={styles.header}>
                <div style={styles.headerLeft}>
                  <div style={styles.agentAvatar}>
                    <HeadsetIcon size={24} />
                  </div>
                  <div>
                    <div style={styles.headerTitle}>Domino's Support</div>
                    <div style={styles.headerStatus}>
                      <span style={styles.statusDot} />
                      <span>Online • Avg. response {'<'}30s</span>
                    </div>
                  </div>
                </div>
                <button 
                  style={{
                    ...styles.callBtn,
                    ...(isHoveringCall ? styles.callBtnHover : {})
                  }}
                  onClick={startCall}
                  onMouseEnter={() => setIsHoveringCall(true)}
                  onMouseLeave={() => setIsHoveringCall(false)}
                >
                  <PhoneIcon />
                  <span>Call Now</span>
                </button>
              </div>

              {/* ================= WELCOME ================= */}
              {messages.length === 0 && (
                <div style={styles.welcomeSection}>
                  <div style={styles.welcomeIconWrapper}>
                    <PizzaIcon />
                  </div>
                  <h2 style={styles.welcomeTitle}>How can we help you today?</h2>
                  <p style={styles.welcomeText}>
                    Get instant support for orders, deliveries, refunds & more
                  </p>
                  <div style={styles.quickActions}>
                    {[
                      { icon: '📦', label: 'Track Order', query: 'Where is my order?' },
                      { icon: '🔄', label: 'Refund', query: 'I need a refund' },
                      { icon: '⚠️', label: 'Issue', query: 'I have a complaint' },
                      { icon: '⭐', label: 'Feedback', query: 'I want to give feedback' },
                    ].map((item, i) => (
                      <button
                        key={i}
                        style={styles.quickBtn}
                        onClick={() => setText(item.query)}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#E31837';
                          e.target.style.color = '#fff';
                          e.target.style.borderColor = '#E31837';
                          e.target.style.transform = 'translateY(-3px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#fff';
                          e.target.style.color = '#374151';
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
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
                      animationDelay: `${i * 0.1}s`,
                    }}
                  >
                    {m.role === 'agent' && (
                      <div style={styles.agentAvatarSmall}>
                        <DominoTileIcon size={20} />
                      </div>
                    )}
                    <div style={m.role === 'user' ? styles.userBubble : styles.agentBubble}>
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
                  placeholder="Type your message..."
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendText()}
                  style={styles.input}
                />
                <button 
                  style={{
                    ...styles.sendBtn,
                    opacity: text.trim() ? 1 : 0.5,
                    transform: text.trim() ? 'scale(1)' : 'scale(0.95)',
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
          <div style={styles.footerContent}>
            <span>📞 1800-208-1234</span>
            <span style={styles.footerDot}>•</span>
            <span>✉️ guestcaredominos@jublfood.com</span>
          </div>
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

  floatingPizza1: {
    position: 'fixed',
    top: '10%',
    left: '5%',
    opacity: 0.15,
    animation: 'float 6s ease-in-out infinite',
    zIndex: 1,
    transform: 'rotate(-15deg) scale(2)',
  },

  floatingPizza2: {
    position: 'fixed',
    bottom: '15%',
    right: '8%',
    opacity: 0.1,
    animation: 'float 8s ease-in-out infinite reverse',
    zIndex: 1,
    transform: 'rotate(20deg) scale(2.5)',
  },

  container: {
    width: '100%',
    maxWidth: 'min(460px, 95vw)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(12px, 2vw, 16px)',
    position: 'relative',
    zIndex: 2,
  },

  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 4px',
  },

  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },

  logoWrapper: {
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
  },

  brandTextWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },

  brandText: {
    color: '#fff',
    fontSize: 'clamp(20px, 5vw, 26px)',
    fontWeight: 800,
    letterSpacing: '-0.5px',
    lineHeight: 1.1,
    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
  },

  brandSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 'clamp(11px, 2.5vw, 13px)',
    fontWeight: 500,
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },

  supportBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)',
    borderRadius: 25,
    color: '#fff',
    fontSize: 'clamp(11px, 2.5vw, 13px)',
    fontWeight: 600,
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.3s ease',
  },

  card: {
    background: '#fff',
    borderRadius: 'clamp(16px, 4vw, 24px)',
    boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: 'clamp(500px, 70vh, 620px)',
  },

  header: {
    padding: 'clamp(14px, 3vw, 18px) clamp(16px, 4vw, 22px)',
    background: 'linear-gradient(135deg, #E31837 0%, #C41230 50%, #A01028 100%)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },

  agentAvatar: {
    width: 'clamp(40px, 10vw, 48px)',
    height: 'clamp(40px, 10vw, 48px)',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 'clamp(14px, 3.5vw, 17px)',
    fontWeight: 700,
  },

  headerStatus: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 'clamp(10px, 2.5vw, 12px)',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 8px #4ade80, 0 0 16px #4ade80',
    animation: 'pulse 2s infinite',
  },

  callBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: 'clamp(10px, 2.5vw, 12px) clamp(16px, 4vw, 22px)',
    borderRadius: 30,
    border: '2px solid rgba(255, 255, 255, 0.4)',
    background: 'rgba(255, 255, 255, 0.15)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 'clamp(12px, 3vw, 14px)',
    cursor: 'pointer',
    backdropFilter: 'blur(5px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  callBtnHover: {
    background: '#fff',
    color: '#E31837',
    borderColor: '#fff',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(255,255,255,0.3)',
  },

  welcomeSection: {
    padding: 'clamp(24px, 5vw, 32px) clamp(20px, 4vw, 28px)',
    textAlign: 'center',
    borderBottom: '1px solid #f0f0f0',
    background: 'linear-gradient(180deg, #fafbfc 0%, #fff 100%)',
  },

  welcomeIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FFF5F5 0%, #FFE5E5 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    boxShadow: '0 8px 24px rgba(227, 24, 55, 0.15)',
  },

  welcomeTitle: {
    fontSize: 'clamp(18px, 4.5vw, 22px)',
    fontWeight: 800,
    color: '#1f2937',
    marginBottom: 8,
  },

  welcomeText: {
    fontSize: 'clamp(12px, 3vw, 14px)',
    color: '#6b7280',
    marginBottom: 20,
  },

  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 10,
  },

  quickBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 'clamp(10px, 2.5vw, 14px)',
    borderRadius: 12,
    border: '2px solid #e5e7eb',
    background: '#fff',
    color: '#374151',
    fontSize: 'clamp(12px, 3vw, 14px)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

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
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #E31837 0%, #C41230 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 3px 10px rgba(227, 24, 55, 0.3)',
  },

  userBubble: {
    maxWidth: '78%',
    padding: 'clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 18px)',
    borderRadius: '20px 20px 4px 20px',
    fontSize: 'clamp(13px, 3.2vw, 15px)',
    lineHeight: 1.5,
    background: 'linear-gradient(135deg, #006491 0%, #005580 100%)',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(0, 100, 145, 0.25)',
  },

  agentBubble: {
    maxWidth: '78%',
    padding: 'clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 18px)',
    borderRadius: '20px 20px 20px 4px',
    fontSize: 'clamp(13px, 3.2vw, 15px)',
    lineHeight: 1.5,
    background: '#fff',
    color: '#1f2937',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },

  inputBar: {
    padding: 'clamp(14px, 3vw, 18px)',
    borderTop: '1px solid #f0f0f0',
    display: 'flex',
    gap: 12,
    background: '#fff',
  },

  input: {
    flex: 1,
    padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 20px)',
    borderRadius: 30,
    border: '2px solid #e5e7eb',
    fontSize: 'clamp(13px, 3.2vw, 15px)',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    background: '#fafbfc',
  },

  sendBtn: {
    width: 'clamp(48px, 12vw, 54px)',
    height: 'clamp(48px, 12vw, 54px)',
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

  callScreen: {
    flex: 1,
    background: 'linear-gradient(180deg, #006491 0%, #004A6E 40%, #003854 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 'clamp(40px, 8vw, 60px) clamp(20px, 5vw, 30px)',
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
    width: 'clamp(90px, 22vw, 110px)',
    height: 'clamp(90px, 22vw, 110px)',
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
    fontSize: 'clamp(24px, 6vw, 30px)',
    fontWeight: 800,
    color: '#fff',
    marginBottom: 4,
  },

  callerRole: {
    fontSize: 'clamp(12px, 3vw, 14px)',
    color: 'rgba(255, 255, 255, 0.75)',
  },

  callTimer: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 24px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: 30,
  },

  timerDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 10px #4ade80',
    animation: 'pulse 1s infinite',
  },

  voiceWave: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    height: 45,
  },

  voiceBar: {
    width: 5,
    background: 'linear-gradient(180deg, #4ade80 0%, #22c55e 100%)',
    borderRadius: 3,
    animation: 'voicePulse 0.6s ease-in-out infinite',
  },

  endCallBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 'clamp(14px, 3.5vw, 18px) clamp(28px, 7vw, 40px)',
    borderRadius: 35,
    border: 'none',
    background: 'linear-gradient(135deg, #E31837 0%, #C41230 100%)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 'clamp(14px, 3.5vw, 16px)',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(227, 24, 55, 0.5)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  footer: {
    textAlign: 'center',
    padding: 'clamp(10px, 2.5vw, 14px)',
    background: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 14,
    backdropFilter: 'blur(10px)',
  },

  footerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'clamp(8px, 2vw, 16px)',
    flexWrap: 'wrap',
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 'clamp(11px, 2.8vw, 13px)',
    fontWeight: 500,
  },

  footerDot: {
    opacity: 0.5,
  },
};
