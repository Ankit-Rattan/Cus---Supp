# Domino's Voice Bot Services

AI-powered voice bot platform for Domino's Pizza operations, built with Next.js and ElevenLabs.

## 🚀 Services

| Service | Description | Route |
|---------|-------------|-------|
| **Customer Agent** | Handle customer support, orders, complaints | `/customer` |
| **Hiring Agent** | Call riders about job opportunities | `/hiring` |
| **Reminder Agent** | Urgent alerts for riders to report to outlet | `/reminder` |
| **Voice Order** | Place pizza orders via voice call | `/voice-order` |

## 📁 Project Structure

```
src/
├── app/
│   ├── page.js              # Landing page with 4 service cards
│   ├── customer/
│   │   └── page.js          # Customer Agent UI
│   ├── hiring/
│   │   └── page.js          # Hiring Agent UI
│   ├── reminder/
│   │   └── page.js          # Reminder Agent UI
│   ├── voice-order/
│   │   └── page.js          # Voice Order UI
│   ├── api/
│   │   ├── tts/             # Text-to-Speech API
│   │   └── upload/          # Image upload API
│   ├── layout.js            # Root layout
│   └── globals.css          # Global styles
├── components/
│   └── AgentUI.js           # Reusable agent interface component
└── lib/
    └── pizzaClassifier.js   # ML model for pizza quality check
```

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        LANDING PAGE (/)                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │Customer │ │ Hiring  │ │Reminder │ │ Voice   │              │
│  │ Agent   │ │ Agent   │ │ Agent   │ │ Order   │              │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘              │
└───────┼──────────┼──────────┼──────────┼────────────────────────┘
        │          │          │          │
        ▼          ▼          ▼          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT UI COMPONENT                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Mode Switcher: [Chat] [Call]                            │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  CHAT MODE              │  CALL MODE                     │  │
│  │  ┌────────────────┐     │  ┌────────────────┐           │  │
│  │  │ Messages Area  │     │  │ Voice Call UI  │           │  │
│  │  │                │     │  │ - Timer        │           │  │
│  │  │ User ←→ Agent  │     │  │ - Wave Visual  │           │  │
│  │  └────────────────┘     │  │ - End Call     │           │  │
│  │  ┌────────────────┐     │  └────────────────┘           │  │
│  │  │ Text Input     │     │                               │  │
│  │  └────────────────┘     │                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐  │
│  │   ElevenLabs    │  │     Resend      │  │  Teachable     │  │
│  │   Voice API     │  │   Email API     │  │  Machine ML    │  │
│  │                 │  │                 │  │                │  │
│  │ - Text Agent    │  │ - Quality       │  │ - Pizza        │  │
│  │ - Voice Agent   │  │   Reports       │  │   Classifier   │  │
│  │ - WebRTC/WS     │  │                 │  │                │  │
│  └─────────────────┘  └─────────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🎨 Design System

### Color Palette

| Agent | Primary Color | Gradient |
|-------|--------------|----------|
| Customer | `#E31837` (Domino's Red) | `#E31837 → #ff3d5a` |
| Hiring | `#006491` (Domino's Blue) | `#006491 → #0088c2` |
| Reminder | `#f59e0b` (Amber) | `#f59e0b → #fbbf24` |
| Voice Order | `#10b981` (Emerald) | `#10b981 → #34d399` |

### Typography

- **Primary Font**: Nunito (weights: 400, 600, 700, 800, 900)
- **Secondary Font**: Rubik (weights: 400, 500, 600, 700)

### UI Components

1. **Service Cards** - Landing page selection cards with icons
2. **Mode Switcher** - Toggle between Chat and Call modes
3. **Chat Interface** - Message bubbles, input field, send button
4. **Call Interface** - Avatar, timer, voice wave visualization, end call
5. **Back Navigation** - Return to landing page from any agent

## ⚙️ Environment Variables

```env
# ElevenLabs API Configuration
NEXT_PUBLIC_TEXT_AGENT_ID=your_text_agent_id
NEXT_PUBLIC_VOICE_AGENT_ID=your_voice_agent_id

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
```

## 🔧 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔌 API Integration Points

### ElevenLabs Voice API

Each agent connects to ElevenLabs via the `@elevenlabs/react` SDK:

```javascript
// Chat Mode (WebSocket)
await agent.startSession({
  agentId: AGENT_ID,
  connectionType: 'websocket',
  overrides: { conversation: { textOnly: true } },
});

// Call Mode (WebRTC)
await agent.startSession({
  agentId: AGENT_ID,
  connectionType: 'webrtc',
});
```

### Agent Configuration

Each agent type requires a separate ElevenLabs agent configured in their dashboard:

| Agent | Purpose | Suggested Persona |
|-------|---------|-------------------|
| Customer | Support queries | Friendly, helpful support rep |
| Hiring | Job recruitment | Professional HR recruiter |
| Reminder | Urgent alerts | Urgent, clear communicator |
| Voice Order | Taking orders | Efficient order taker |

## 📱 Responsive Design

- Mobile-first approach
- Fluid typography using `clamp()`
- Adaptive layouts for all screen sizes
- Touch-friendly interaction targets

## 🛠 Tech Stack

- **Framework**: Next.js 16
- **Styling**: CSS-in-JS (inline styles)
- **Voice AI**: ElevenLabs
- **ML**: TensorFlow.js / Teachable Machine
- **Email**: Resend
- **Fonts**: Google Fonts (Nunito, Rubik)

---

Built for JFL Hackathon 2026 🏆
