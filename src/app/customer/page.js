'use client';

import AgentUI from '../../components/AgentUI';

export default function CustomerAgentPage() {
  return (
    <AgentUI
      config={{
        title: 'Customer Support',
        tagline: 'Customer Agent',
        welcomeTitle: 'Hi there! 👋',
        welcomeText: 'How can we help you today? Ask about orders, complaints, or general support.',
        agentName: 'Jay',
        agentRole: 'Support Agent',
        placeholder: 'Describe your issue...',
        color: '#E31837',
        gradient: 'linear-gradient(135deg, #E31837 0%, #ff3d5a 100%)',
      }}
    />
  );
}
