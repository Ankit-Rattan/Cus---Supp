'use client';

import AgentUI from '../../components/AgentUI';

export default function ReminderAgentPage() {
  return (
    <AgentUI
      agentId={process.env.NEXT_PUBLIC_REMINDER_AGENT_ID}
      config={{
        title: 'Urgent Alert',
        tagline: 'Reminder Agent',
        welcomeTitle: 'Urgent Call! ⚡',
        welcomeText: 'Alert riders to report to outlet immediately for urgent service needs.',
        agentName: 'Harry',
        agentRole: 'Reminder Agent',
        placeholder: 'Enter rider details or outlet info...',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      }}
    />
  );
}
