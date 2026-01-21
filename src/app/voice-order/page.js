'use client';

import AgentUI from '../../components/AgentUI';

export default function VoiceOrderPage() {
  return (
    <AgentUI
      config={{
        title: 'Voice Order',
        tagline: 'Order by Voice',
        welcomeTitle: 'Order Pizza! 🍕',
        welcomeText: 'Place your pizza order using voice commands. Fast, easy, and hands-free!',
        agentName: 'Maya',
        agentRole: 'Order Agent',
        placeholder: 'Tell us what you want to order...',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      }}
    />
  );
}
