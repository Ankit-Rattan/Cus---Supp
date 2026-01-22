'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Service Icons
const CustomerIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
);

const HiringIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const ReminderIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    <path d="M12 2v2"/>
  </svg>
);

const VoiceOrderIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" x2="12" y1="19" y2="22"/>
  </svg>
);

const ArrowIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/>
    <path d="m12 5 7 7-7 7"/>
  </svg>
);

const services = [
  {
    id: 'customer',
    title: 'Customer Agent',
    description: 'Get help with orders, complaints, and general support',
    icon: CustomerIcon,
    color: '#E31837',
    gradient: 'linear-gradient(135deg, #E31837 0%, #ff3d5a 100%)',
    path: '/customer',
  },
  {
    id: 'hiring',
    title: 'Hiring Agent',
    description: 'Job opportunities for delivery riders and staff',
    icon: HiringIcon,
    color: '#006491',
    gradient: 'linear-gradient(135deg, #006491 0%, #0088c2 100%)',
    path: '/hiring',
  },
  {
    id: 'reminder',
    title: 'Reminder Agent',
    description: 'Urgent alerts for riders to report to outlet',
    icon: ReminderIcon,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    path: '/reminder',
  },
  {
    id: 'voice-order',
    title: 'Voice Order',
    description: 'Place your pizza order via voice call',
    icon: VoiceOrderIcon,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    path: '/voice-order',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={styles.page}>
      {/* Background */}
      <div style={styles.bgImageWrapper}>
        <Image
          src="/pizza-bg.jpg"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Gradient Overlay */}
      <div style={styles.gradientOverlay}>
        <div style={styles.circle1} />
        <div style={styles.circle2} />
        <div style={styles.circle3} />
      </div>

      {/* Main Content */}
      <div style={styles.container}>
        {/* Logo Header */}
        <header style={styles.logoHeader}>
          <Image
            src="/dominos-logo.png"
            alt="Domino's"
            width={200}
            height={62}
            style={{ objectFit: 'contain', width: 'auto', height: 'auto' }}
            priority
          />
          <p style={styles.tagline}>Voice Bot Services</p>
        </header>

        {/* Welcome Section */}
        <div style={styles.welcomeCard}>
          <h1 style={styles.welcomeTitle}>Welcome! 👋</h1>
          <p style={styles.welcomeText}>Select a service to get started with our AI-powered voice assistants</p>
        </div>

        {/* Service Cards Grid */}
        <div style={styles.cardsGrid}>
          {services.map((service) => (
            <button
              key={service.id}
              style={{
                ...styles.serviceCard,
                ...(hoveredCard === service.id ? styles.serviceCardHover : {}),
              }}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => router.push(service.path)}
            >
              <div style={{ ...styles.iconWrapper, background: service.gradient }}>
                <service.icon size={32} />
              </div>
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{service.title}</h3>
                <p style={styles.cardDescription}>{service.description}</p>
              </div>
              <div style={{ ...styles.arrowWrapper, background: hoveredCard === service.id ? service.gradient : '#f1f5f9' }}>
                <ArrowIcon size={18} />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <span>📞 1800-208-1234</span>
          <span style={styles.footerDot}>•</span>
          <span>24/7 Support</span>
        </footer>
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
    padding: 'clamp(16px, 4vw, 32px)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Nunito', 'Rubik', sans-serif",
  },

  bgImageWrapper: {
    position: 'fixed',
    inset: 0,
    zIndex: 0,
  },

  gradientOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1,
    background: `linear-gradient(
      135deg,
      rgba(0, 100, 145, 0.97) 0%,
      rgba(0, 85, 125, 0.98) 50%,
      rgba(0, 65, 100, 0.99) 100%
    )`,
  },

  circle1: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(227, 24, 55, 0.2) 0%, transparent 70%)',
    top: '-200px',
    right: '-100px',
    animation: 'float 8s ease-in-out infinite',
  },

  circle2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0, 150, 200, 0.3) 0%, transparent 70%)',
    bottom: '-100px',
    left: '-50px',
    animation: 'float 10s ease-in-out infinite reverse',
  },

  circle3: {
    position: 'absolute',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'float 12s ease-in-out infinite',
  },

  container: {
    width: '100%',
    maxWidth: 'min(500px, 94vw)',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    position: 'relative',
    zIndex: 2,
  },

  logoHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.2))',
  },

  tagline: {
    color: '#fff',
    fontSize: 'clamp(14px, 3.5vw, 18px)',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '4px',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },

  welcomeCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 'clamp(20px, 5vw, 28px)',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(0, 60, 100, 0.2)',
  },

  welcomeTitle: {
    fontSize: 'clamp(26px, 6vw, 32px)',
    fontWeight: 900,
    color: '#1e293b',
    marginBottom: 8,
  },

  welcomeText: {
    fontSize: 'clamp(14px, 3.5vw, 16px)',
    fontWeight: 600,
    color: '#64748b',
    lineHeight: 1.5,
  },

  cardsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },

  serviceCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 'clamp(16px, 4vw, 20px)',
    background: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 8px 30px rgba(0, 60, 100, 0.15)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'left',
    width: '100%',
  },

  serviceCardHover: {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: '0 20px 50px rgba(0, 60, 100, 0.25)',
  },

  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    flexShrink: 0,
    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
  },

  cardContent: {
    flex: 1,
    minWidth: 0,
  },

  cardTitle: {
    fontSize: 'clamp(16px, 4vw, 18px)',
    fontWeight: 800,
    color: '#1e293b',
    marginBottom: 4,
    fontFamily: "'Nunito', sans-serif",
  },

  cardDescription: {
    fontSize: 'clamp(12px, 3vw, 14px)',
    fontWeight: 600,
    color: '#64748b',
    lineHeight: 1.4,
  },

  arrowWrapper: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    flexShrink: 0,
    transition: 'all 0.3s ease',
  },

  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 'clamp(14px, 3.5vw, 18px)',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0,100,145,0.2)',
    backdropFilter: 'blur(10px)',
    color: '#1e293b',
    fontSize: 'clamp(13px, 3.2vw, 15px)',
    fontWeight: 700,
  },

  footerDot: { color: '#E31837' },
};
