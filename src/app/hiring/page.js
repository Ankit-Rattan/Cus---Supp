'use client';

import AgentUI from '../../components/AgentUI';

export default function HiringAgentPage() {
  return (
    <AgentUI
      agentId={process.env.NEXT_PUBLIC_HIRING_AGENT_ID}
      config={{
        title: 'Hiring Support',
        tagline: 'Hiring Agent',
        welcomeTitle: 'Join Our Team! 🚴',
        welcomeText: 'Interested in delivery rider positions? Let us tell you about job opportunities!',
        agentName: 'Harry',
        agentRole: 'Hiring Agent',
        placeholder: 'Ask about job opportunities...',
        color: '#006491',
        gradient: 'linear-gradient(135deg, #006491 0%, #0088c2 100%)',
      }}
    />
  );
}
