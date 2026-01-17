'use client';

import { useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';

export default function VoiceSDKPage() {
  const conversation = useConversation({
    onConnect: () => {
      console.log('✅ Connected to ElevenLabs Agent');
    },
    onDisconnect: () => {
      console.log('❌ Disconnected from Agent');
    },
    onError: (err) => {
      console.error('Agent error:', err);
    },
  });

  async function startCall() {
    // Ask mic permission first (MANDATORY)
    await navigator.mediaDevices.getUserMedia({ audio: true });

    // Start conversation with your agent
    await conversation.startSession({
      agentId: 'agent_5001key01754fpq86knqyry7r34h', // <-- paste from ElevenLabs UI
      connectionType: 'webrtc',            // recommended
      userId: 'ankit-user-001',             // optional but good
    });
  }

  async function endCall() {
    await conversation.endSession();
  }

  return (
    <div
      style={{
        marginTop: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}
    >
      {/* Status Indicator */}
      <div
        style={{
          width: conversation.isSpeaking ? 120 : 80,
          height: conversation.isSpeaking ? 120 : 80,
          borderRadius: '50%',
          background: conversation.isSpeaking ? '#ff4d4f' : '#22c55e',
          transition: 'all 0.3s ease',
        }}
      />

      <p style={{ fontSize: 18 }}>
        {conversation.isSpeaking
          ? 'Agent is speaking...'
          : 'You can speak now'}
      </p>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={startCall}>Start Call</button>
        <button onClick={endCall}>End Call</button>
      </div>

      <p>Status: {conversation.status}</p>
    </div>
  );
}
