'use client';

import AgentUI from '../../components/AgentUI';

export default function HiringAgentPage() {
  return (
    <AgentUI
      config={{
        title: 'Hiring Support',
        tagline: 'Hiring Agent',
        welcomeTitle: 'Join Our Team! 🚴',
        welcomeText: 'Interested in delivery rider positions? Let us tell you about job opportunities!',
        agentName: 'Sam',
        agentRole: 'Hiring Agent',
        placeholder: 'Ask about job opportunities...',
        color: '#006491',
        gradient: 'linear-gradient(135deg, #006491 0%, #0088c2 100%)',
      }}
    />
  );
}
